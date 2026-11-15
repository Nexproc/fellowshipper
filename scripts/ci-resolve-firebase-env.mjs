#!/usr/bin/env node
/**
 * Resolves Firebase Web SDK environment variables (VITE_FIREBASE_*) and verifies
 * GCP Identity Platform OAuth configuration (authorizedDomains, Google IdP, Discord OIDC)
 * directly from FIREBASE_SERVICE_ACCOUNT during CI builds.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';

function appendLines(filePath, lines) {
  if (!filePath) return;
  fs.appendFileSync(filePath, `${lines.join('\n')}\n`, 'utf-8');
}

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf-8');
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function mintAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    sub: sa.client_email,
    aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/firebase',
      'https://www.googleapis.com/auth/identitytoolkit',
    ].join(' '),
  };

  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(payload)
  )}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = base64UrlEncode(signer.sign(sa.private_key));
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch(sa.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to mint GCP access token (${res.status}): ${errText}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function gcpFetchJson(url, token, projectId, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Goog-User-Project': projectId,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

async function smokeTestAuthUri(apiKey, providerId, continueUri) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${encodeURIComponent(
      apiKey
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providerId, continueUri }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.log(
      `[oauth-check] createAuthUri(${providerId}) -> HTTP ${res.status}: ${
        data?.error?.message || 'failed'
      }`
    );
    return;
  }
  try {
    const parsed = new URL(data.authUri);
    console.log(
      `[oauth-check] createAuthUri(${providerId}) -> OK (${parsed.origin}${
        parsed.pathname
      }, response_type=${parsed.searchParams.get('response_type')}, scope="${
        parsed.searchParams.get('scope') || ''
      }")`
    );
  } catch {
    console.log(`[oauth-check] createAuthUri(${providerId}) -> HTTP 200`);
  }
}

async function main() {
  const rawSa = (process.env.FIREBASE_SERVICE_ACCOUNT || '').trim();
  if (!rawSa) {
    console.log('FIREBASE_SERVICE_ACCOUNT not set; skipping cloud Firebase config resolution.');
    appendLines(process.env.GITHUB_OUTPUT, ['ready=false', 'project_id=']);
    return;
  }

  const sa = JSON.parse(rawSa);
  const projectId = (process.env.FIREBASE_PROJECT_ID_OVERRIDE || sa.project_id || '').trim();
  if (!projectId) {
    throw new Error('Service account JSON is missing project_id.');
  }

  const token = await mintAccessToken(sa);
  console.log(`-> Authenticated to GCP project "${projectId}" via service account.`);

  // 1. Fetch Firebase Web App SDK Config
  const appsResp = await gcpFetchJson(
    `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps`,
    token,
    projectId
  );
  const appId = appsResp.json?.apps?.[0]?.appId;
  if (!appId) {
    throw new Error(`No Firebase Web App registered on project "${projectId}".`);
  }

  const cfgResp = await gcpFetchJson(
    `https://firebase.googleapis.com/v1beta1/projects/${projectId}/webApps/${appId}/config`,
    token,
    projectId
  );
  if (!cfgResp.ok || !cfgResp.json?.apiKey) {
    throw new Error(`Failed to fetch Firebase Web SDK config (${cfgResp.status}).`);
  }
  const cfg = cfgResp.json;

  // 2. Ensure GitHub Pages & custom domain are in Firebase Auth authorizedDomains
  const requiredDomains = [
    'localhost',
    `${projectId}.firebaseapp.com`,
    `${projectId}.web.app`,
    'www.nicktitcombe.com',
    'nicktitcombe.com',
    'nexproc.github.io',
  ];
  const idpCfgResp = await gcpFetchJson(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`,
    token,
    projectId
  );
  if (idpCfgResp.ok) {
    const existingDomains = Array.isArray(idpCfgResp.json.authorizedDomains)
      ? idpCfgResp.json.authorizedDomains
      : [];
    const mergedDomains = Array.from(new Set([...existingDomains, ...requiredDomains]));
    const missing = requiredDomains.filter((d) => !existingDomains.includes(d));
    if (missing.length > 0) {
      console.log(`-> Adding missing Firebase Auth authorizedDomains: ${missing.join(', ')}`);
      const patchResp = await gcpFetchJson(
        `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config?updateMask=authorizedDomains`,
        token,
        projectId,
        {
          method: 'PATCH',
          body: JSON.stringify({ authorizedDomains: mergedDomains }),
        }
      );
      console.log(
        `-> Updated authorizedDomains (HTTP ${patchResp.status}): ${(
          patchResp.json?.authorizedDomains || mergedDomains
        ).join(', ')}`
      );
    } else {
      console.log(`-> Firebase Auth authorizedDomains verified: ${existingDomains.join(', ')}`);
    }
  } else {
    console.log(
      `-> Could not read Identity Platform config (HTTP ${idpCfgResp.status}); continuing.`
    );
  }

  // 3. Inspect Google IdP & OIDC Providers (to resolve exact Discord OIDC provider ID)
  const googleResp = await gcpFetchJson(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/defaultSupportedIdpConfigs/google.com`,
    token,
    projectId
  );
  console.log(
    `[oauth-check] Google IdP status: HTTP ${googleResp.status}, enabled=${Boolean(
      googleResp.json?.enabled
    )}`
  );

  let discordProviderId = 'oidc.discord';
  const oidcResp = await gcpFetchJson(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/oauthIdpConfigs`,
    token,
    projectId
  );
  if (oidcResp.ok && Array.isArray(oidcResp.json?.oauthIdpConfigs)) {
    for (const idp of oidcResp.json.oauthIdpConfigs) {
      const shortId = String(idp.name || '').split('/').pop() || '';
      const issuer = String(idp.issuer || '');
      const enabled = Boolean(idp.enabled);
      const grantCode = Boolean(idp.responseType?.code);
      const grantIdToken = Boolean(idp.responseType?.idToken);
      console.log(
        `[oauth-check] OIDC provider "${shortId}": enabled=${enabled}, issuer=${issuer}, code=${grantCode}, idToken=${grantIdToken}`
      );
      if (
        shortId.toLowerCase().includes('discord') ||
        issuer.toLowerCase().includes('discord')
      ) {
        discordProviderId = shortId;
      }
    }
  } else {
    console.log(`[oauth-check] OIDC configs list: HTTP ${oidcResp.status}`);
  }

  // 4. Smoke-test createAuthUri against live public domain
  const testContinueUri = 'https://www.nicktitcombe.com/fellowshipper/';
  await smokeTestAuthUri(cfg.apiKey, 'google.com', testContinueUri);
  await smokeTestAuthUri(cfg.apiKey, discordProviderId, testContinueUri);

  // 5. Write .firebaserc and export VITE_FIREBASE_* to GITHUB_ENV
  fs.writeFileSync(
    '.firebaserc',
    `${JSON.stringify({ projects: { default: projectId } }, null, 2)}\n`,
    'utf-8'
  );

  const envVars = [
    `VITE_FIREBASE_API_KEY=${cfg.apiKey}`,
    `VITE_FIREBASE_AUTH_DOMAIN=${cfg.authDomain || `${projectId}.firebaseapp.com`}`,
    `VITE_FIREBASE_PROJECT_ID=${cfg.projectId || projectId}`,
    `VITE_FIREBASE_DATABASE_URL=${
      cfg.databaseURL || `https://${projectId}-default-rtdb.firebaseio.com`
    }`,
    `VITE_FIREBASE_STORAGE_BUCKET=${cfg.storageBucket || `${projectId}.firebasestorage.app`}`,
    `VITE_FIREBASE_MESSAGING_SENDER_ID=${cfg.messagingSenderId || ''}`,
    `VITE_FIREBASE_APP_ID=${cfg.appId || appId}`,
    `VITE_DISCORD_OIDC_PROVIDER_ID=${discordProviderId}`,
  ];

  appendLines(process.env.GITHUB_ENV, envVars);
  appendLines(process.env.GITHUB_OUTPUT, [`ready=true`, `project_id=${projectId}`]);
  console.log(
    `-> Exported VITE_FIREBASE_* and VITE_DISCORD_OIDC_PROVIDER_ID=${discordProviderId} for build.`
  );
}

main().catch((err) => {
  console.error('ERROR in ci-resolve-firebase-env:', err.message);
  process.exit(1);
});
