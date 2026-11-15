import type { AuthUserInfo, MemberProfile } from './types.ts';

export interface OwnershipContext {
  /** True when Firebase Cloud Auth/Sync is configured; false in local offline/dev mode */
  authEnforced: boolean;
  currentUser: AuthUserInfo | null;
  leadMemberId: string;
  members: readonly MemberProfile[];
}

export interface MemberPermissions {
  isClaimed: boolean;
  isOwnedByCurrentUser: boolean;
  canClaim: boolean;
  canReleaseClaim: boolean;
  /** Add/delete characters, add/delete BIS items, switch BIS sets */
  canEditBuilds: boolean;
  /** Toggle acquired status on BIS drops or toggle inParty */
  canToggleLootAndParty: boolean;
  lockReason: string | null;
}

export function resolveMemberIdForUser(
  members: readonly MemberProfile[],
  uid: string | null | undefined
): string | null {
  if (!uid) return null;
  const owned = members.find((m) => m.ownerUid === uid);
  return owned ? owned.id : null;
}

export function evaluateMemberPermissions(
  member: MemberProfile,
  ctx: OwnershipContext
): MemberPermissions {
  if (!ctx.authEnforced) {
    return {
      isClaimed: Boolean(member.ownerUid),
      isOwnedByCurrentUser: true,
      canClaim: false,
      canReleaseClaim: Boolean(member.ownerUid),
      canEditBuilds: true,
      canToggleLootAndParty: true,
      lockReason: null,
    };
  }

  const uid = ctx.currentUser?.uid ?? null;
  const isClaimed = Boolean(member.ownerUid);
  const isOwnedByCurrentUser = Boolean(uid && member.ownerUid === uid);

  if (!uid) {
    return {
      isClaimed,
      isOwnedByCurrentUser: false,
      canClaim: false,
      canReleaseClaim: false,
      canEditBuilds: false,
      canToggleLootAndParty: false,
      lockReason: 'Sign in with Google or Discord to manage characters and gear.',
    };
  }

  const currentUsersMemberId = resolveMemberIdForUser(ctx.members, uid);
  const isCurrentUserPartyLead =
    currentUsersMemberId !== null && currentUsersMemberId === ctx.leadMemberId;

  if (!isClaimed) {
    return {
      isClaimed: false,
      isOwnedByCurrentUser: false,
      canClaim: true,
      canReleaseClaim: false,
      canEditBuilds: false,
      canToggleLootAndParty: true,
      lockReason: `Unclaimed slot — click "Claim ${member.displayName}" to bind it to your login.`,
    };
  }

  if (isOwnedByCurrentUser) {
    return {
      isClaimed: true,
      isOwnedByCurrentUser: true,
      canClaim: false,
      canReleaseClaim: true,
      canEditBuilds: true,
      canToggleLootAndParty: true,
      lockReason: null,
    };
  }

  const leadAllowedLoot =
    (member.allowPartyLeadLootCheck ?? true) && isCurrentUserPartyLead;

  return {
    isClaimed: true,
    isOwnedByCurrentUser: false,
    canClaim: false,
    canReleaseClaim: false,
    canEditBuilds: false,
    canToggleLootAndParty: leadAllowedLoot,
    lockReason: `Owned by ${member.ownerDisplayName ?? member.displayName}${
      member.ownerProvider ? ` (${member.ownerProvider})` : ''
    }. View-only for other party members.`,
  };
}

export function claimMemberSlot(
  member: MemberProfile,
  user: AuthUserInfo
): MemberProfile {
  if (member.ownerUid && member.ownerUid !== user.uid) {
    return member;
  }
  return {
    ...member,
    ownerUid: user.uid,
    ownerDisplayName: user.displayName,
    ownerProvider: user.provider,
    ownerPhotoUrl: user.photoUrl,
    allowPartyLeadLootCheck: member.allowPartyLeadLootCheck ?? true,
  };
}

export function releaseMemberSlot(
  member: MemberProfile,
  requestingUid: string
): MemberProfile {
  if (member.ownerUid !== requestingUid) {
    return member;
  }
  return {
    ...member,
    ownerUid: null,
    ownerDisplayName: null,
    ownerProvider: null,
    ownerPhotoUrl: null,
  };
}
