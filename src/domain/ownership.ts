import type {
  AuthUserInfo,
  HeroId,
  MemberProfile,
  PartySyncState,
} from './types.ts';

export interface OwnershipContext {
  /** True when Firebase Cloud Auth/Sync is configured; false in local offline/dev mode */
  authEnforced: boolean;
  currentUser: AuthUserInfo | null;
  leadMemberId: string;
  members: readonly MemberProfile[];
  /** UIDs of party owners (`ownerUids` on PartySyncState). Must have >= 1 owner once initialized. */
  partyOwnerUids?: readonly string[];
}

export interface PartyPermissions {
  ownerUids: readonly string[];
  hasPartyOwner: boolean;
  isPartyOwner: boolean;
  canClaimUnownedParty: boolean;
  canManageParty: boolean;
  canAddCoOwner: boolean;
  canRelinquishOwnership: boolean;
}

export interface MemberPermissions {
  isClaimed: boolean;
  isOwnedByCurrentUser: boolean;
  isPartyOwnerSlot: boolean;
  canClaim: boolean;
  canReleaseClaim: boolean;
  /** Add/delete characters, add/delete BIS items, switch BIS sets */
  canEditBuilds: boolean;
  /** Toggle acquired status on BIS drops or toggle inParty */
  canToggleLootAndParty: boolean;
  /** Remove this member slot from the party roster */
  canRemoveSlot: boolean;
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

export function evaluatePartyPermissions(
  ctx: OwnershipContext
): PartyPermissions {
  const owners = ctx.partyOwnerUids ?? [];

  if (!ctx.authEnforced) {
    return {
      ownerUids: owners,
      hasPartyOwner: owners.length >= 1,
      isPartyOwner: true,
      canClaimUnownedParty: owners.length === 0,
      canManageParty: true,
      canAddCoOwner: true,
      canRelinquishOwnership: owners.length > 1,
    };
  }

  const uid = ctx.currentUser?.uid ?? null;
  const hasPartyOwner = owners.length >= 1;
  const isPartyOwner = Boolean(uid && owners.includes(uid));

  return {
    ownerUids: owners,
    hasPartyOwner,
    isPartyOwner,
    canClaimUnownedParty: Boolean(uid && !hasPartyOwner),
    canManageParty: isPartyOwner,
    canAddCoOwner: isPartyOwner,
    canRelinquishOwnership: Boolean(isPartyOwner && owners.length > 1),
  };
}

function isSoleOwnerMemberSlot(
  member: MemberProfile,
  members: readonly MemberProfile[],
  partyOwnerUids: readonly string[]
): boolean {
  if (!member.ownerUid || !partyOwnerUids.includes(member.ownerUid)) {
    return false;
  }
  const otherOwnerMembers = members.filter(
    (m) =>
      m.id !== member.id &&
      Boolean(m.ownerUid) &&
      partyOwnerUids.includes(m.ownerUid as string)
  );
  return otherOwnerMembers.length === 0;
}

export function evaluateMemberPermissions(
  member: MemberProfile,
  ctx: OwnershipContext
): MemberPermissions {
  const owners = ctx.partyOwnerUids ?? [];
  const partyPerms = evaluatePartyPermissions(ctx);
  const isPartyOwnerSlot = Boolean(
    member.ownerUid && owners.includes(member.ownerUid)
  );
  const soleOwnerSlot = isSoleOwnerMemberSlot(member, ctx.members, owners);

  if (!ctx.authEnforced) {
    return {
      isClaimed: Boolean(member.ownerUid),
      isOwnedByCurrentUser: true,
      isPartyOwnerSlot,
      canClaim: false,
      canReleaseClaim: Boolean(member.ownerUid) && !soleOwnerSlot,
      canEditBuilds: true,
      canToggleLootAndParty: true,
      canRemoveSlot: ctx.members.length > 1 || !soleOwnerSlot,
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
      isPartyOwnerSlot,
      canClaim: false,
      canReleaseClaim: false,
      canEditBuilds: false,
      canToggleLootAndParty: false,
      canRemoveSlot: false,
      lockReason: 'Sign in with Discord or Google to manage characters and gear.',
    };
  }

  const currentUsersMemberId = resolveMemberIdForUser(ctx.members, uid);
  const isCurrentUserPartyLead =
    currentUsersMemberId !== null && currentUsersMemberId === ctx.leadMemberId;

  if (!isClaimed) {
    return {
      isClaimed: false,
      isOwnedByCurrentUser: false,
      isPartyOwnerSlot: false,
      canClaim: true,
      canReleaseClaim: false,
      canEditBuilds: false,
      canToggleLootAndParty: true,
      canRemoveSlot: partyPerms.isPartyOwner,
      lockReason: `Unclaimed slot — click "Claim ${member.displayName}" to bind it to your login.`,
    };
  }

  if (isOwnedByCurrentUser) {
    return {
      isClaimed: true,
      isOwnedByCurrentUser: true,
      isPartyOwnerSlot,
      canClaim: false,
      canReleaseClaim: !soleOwnerSlot,
      canEditBuilds: true,
      canToggleLootAndParty: true,
      canRemoveSlot: !soleOwnerSlot,
      lockReason: null,
    };
  }

  const leadOrOwnerAllowedLoot =
    partyPerms.isPartyOwner ||
    ((member.allowPartyLeadLootCheck ?? true) && isCurrentUserPartyLead);

  return {
    isClaimed: true,
    isOwnedByCurrentUser: false,
    isPartyOwnerSlot,
    canClaim: false,
    canReleaseClaim: false,
    canEditBuilds: false,
    canToggleLootAndParty: leadOrOwnerAllowedLoot,
    canRemoveSlot: partyPerms.isPartyOwner && !soleOwnerSlot,
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
  requestingUid: string,
  partyOwnerUids: readonly string[] = [],
  allMembers: readonly MemberProfile[] = []
): MemberProfile {
  if (member.ownerUid !== requestingUid) {
    return member;
  }
  if (isSoleOwnerMemberSlot(member, allMembers, partyOwnerUids)) {
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

/**
 * Promotes another claimed party member to Party Co-Owner.
 * Only an existing Party Owner can add a co-owner, and the target slot must be claimed.
 */
export function promotePartyOwner(
  ownerUids: readonly string[],
  targetMember: MemberProfile,
  actorUid: string
): string[] {
  if (!ownerUids.includes(actorUid)) return [...ownerUids];
  if (!targetMember.ownerUid) return [...ownerUids];
  if (ownerUids.includes(targetMember.ownerUid)) return [...ownerUids];
  return [...ownerUids, targetMember.ownerUid];
}

/**
 * Removes a Party Owner, strictly enforcing the `ownerUids.length >= 1` invariant.
 * The last remaining Party Owner can never be removed.
 */
export function removePartyOwner(
  ownerUids: readonly string[],
  targetUid: string,
  actorUid: string
): string[] {
  if (!ownerUids.includes(actorUid)) return [...ownerUids];
  if (!ownerUids.includes(targetUid)) return [...ownerUids];
  if (ownerUids.length <= 1) return [...ownerUids];
  return ownerUids.filter((uid) => uid !== targetUid);
}

/**
 * Claims an unowned legacy party so `ownerUids.length >= 1` and at least one
 * roster member is bound to the claiming owner.
 */
export function claimUnownedPartyState(
  state: PartySyncState,
  user: AuthUserInfo,
  fallbackHeroId: HeroId = 'helena'
): PartySyncState {
  if (state.ownerUids.length > 0) return state;

  let members = [...state.members];
  const alreadyOwned = members.find((m) => m.ownerUid === user.uid);

  if (!alreadyOwned) {
    const unclaimedIdx = members.findIndex((m) => !m.ownerUid);
    if (unclaimedIdx >= 0) {
      members[unclaimedIdx] = claimMemberSlot(members[unclaimedIdx], user);
    } else {
      const slugId =
        user.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
        `owner-${Date.now().toString(36)}`;
      const charId = `${slugId}-${fallbackHeroId}`;
      const setId = `${charId}-bis`;
      members = [
        {
          id: slugId,
          displayName: user.displayName,
          inParty: members.filter((m) => m.inParty).length < 4,
          activeCharacterId: charId,
          ownerUid: user.uid,
          ownerDisplayName: user.displayName,
          ownerProvider: user.provider,
          ownerPhotoUrl: user.photoUrl,
          allowPartyLeadLootCheck: true,
          characters: [
            {
              id: charId,
              heroId: fallbackHeroId,
              title: 'Main',
              activeBisSetId: setId,
              bisSets: [{ id: setId, name: 'Season 2 BIS', items: [] }],
            },
          ],
        },
        ...members,
      ];
    }
  }

  const ownerMember = members.find((m) => m.ownerUid === user.uid) ?? members[0];

  return {
    ...state,
    ownerUids: [user.uid],
    createdByUid: state.createdByUid ?? user.uid,
    createdByName: state.createdByName ?? user.displayName,
    leadMemberId: state.leadMemberId || ownerMember?.id || '',
    members,
  };
}
