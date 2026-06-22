import { Move, UserProfile } from "@/data/mockData";

const LEGACY_MOVES_KEY = "brio_moves";
const USER_SHELL_KEY = "brio_phase1_user";
const MOVES_KEY = "brio_phase1_moves";
const ATTENDEES_KEY = "brio_phase1_move_attendees";

const CURRENT_USER_ID = "current-user";

export type BackendMoveStatus = "active" | "canceled" | "completed";
export type MoveAttendeeStatus = "joined" | "left" | "removed";

export type UserShell = {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl?: string;
  city?: string;
  createdAt: number;
  updatedAt: number;
};

export type BackendMove = {
  id: string;
  hostUserId: string;
  title: string;
  category: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  startTime: string;
  endTime?: string;
  status: BackendMoveStatus;
  maxSpots: number;
  details: string;
  vibeTags: string[];
  hostApprovalRequired: boolean;
  createdAt: number;
  updatedAt: number;
  canceledAt?: number;
  legacyView: {
    distance: string;
    hostName: string;
    hostLevel: number;
    isCircleMove?: boolean;
  };
};

export type MoveAttendee = {
  id: string;
  moveId: string;
  userId: string;
  status: MoveAttendeeStatus;
  joinedAt?: number;
  leftAt?: number;
  createdAt: number;
  updatedAt: number;
};

function safeParse<T>(raw: string | null): T | null {
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function read<T>(key: string, fallback: T): T {
  return safeParse<T>(localStorage.getItem(key)) ?? fallback;
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function currentUserShell(profile: UserProfile): UserShell {
  const existing = safeParse<UserShell>(localStorage.getItem(USER_SHELL_KEY));
  const now = Date.now();
  const shell: UserShell = {
    id: CURRENT_USER_ID,
    displayName: profile.username,
    handle: profile.username,
    city: "Chicago",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  write(USER_SHELL_KEY, shell);
  return shell;
}

function toBackendMove(move: Move, user: UserShell): BackendMove {
  const now = Date.now();
  return {
    id: move.id,
    hostUserId: move.hostName === user.displayName ? user.id : `host:${move.hostName}`,
    title: move.title,
    category: move.category,
    locationName: move.location,
    startTime: move.time,
    status: "active",
    maxSpots: move.maxSpots,
    details: move.description,
    vibeTags: move.vibeTags,
    hostApprovalRequired: move.requiresApproval,
    createdAt: now,
    updatedAt: now,
    legacyView: {
      distance: move.distance,
      hostName: move.hostName,
      hostLevel: move.hostLevel,
      isCircleMove: move.isCircleMove,
    },
  };
}

function attendeeId(moveId: string, userId: string) {
  return `attendee:${moveId}:${userId}`;
}

function seedAttendeesFromMoves(moves: Move[], user: UserShell): MoveAttendee[] {
  const now = Date.now();
  return moves.flatMap((move) => {
    const currentUserRecord: MoveAttendee[] = move.joined ? [{
      id: attendeeId(move.id, user.id),
      moveId: move.id,
      userId: user.id,
      status: "joined" as const,
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    }] : [];
    const syntheticCount = Math.max(0, move.going - currentUserRecord.length);
    const syntheticRecords: MoveAttendee[] = Array.from({ length: syntheticCount }, (_, index) => ({
      id: attendeeId(move.id, `mock-attendee-${index + 1}`),
      moveId: move.id,
      userId: `mock-attendee-${index + 1}`,
      status: "joined",
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    }));
    return [...currentUserRecord, ...syntheticRecords];
  });
}

function activeAttendeeCount(moveId: string, attendees: MoveAttendee[]) {
  return attendees.filter((a) => a.moveId === moveId && a.status === "joined").length;
}

function currentUserJoined(moveId: string, attendees: MoveAttendee[], user: UserShell) {
  return attendees.some((a) => a.moveId === moveId && a.userId === user.id && a.status === "joined");
}

function toMoveView(move: BackendMove, attendees: MoveAttendee[], user: UserShell): Move {
  const going = activeAttendeeCount(move.id, attendees);
  return {
    id: move.id,
    title: move.title,
    category: move.category,
    distance: move.legacyView.distance,
    time: move.startTime,
    going,
    maxSpots: move.maxSpots,
    hostName: move.legacyView.hostName,
    hostLevel: move.legacyView.hostLevel,
    vibeTags: move.vibeTags,
    description: move.details,
    location: move.locationName,
    requiresApproval: move.hostApprovalRequired,
    joined: currentUserJoined(move.id, attendees, user),
    isCircleMove: move.legacyView.isCircleMove,
  };
}

function syncLegacyMoves(moves: BackendMove[], attendees: MoveAttendee[], user: UserShell) {
  const activeMoves = moves
    .filter((move) => move.status === "active")
    .map((move) => toMoveView(move, attendees, user));
  write(LEGACY_MOVES_KEY, activeMoves);
  return activeMoves;
}

export function initializePhase1Storage(defaultMoves: Move[], profile: UserProfile): Move[] {
  const user = currentUserShell(profile);
  const legacyMoves = read<Move[]>(LEGACY_MOVES_KEY, defaultMoves);
  const existingMoves = safeParse<BackendMove[]>(localStorage.getItem(MOVES_KEY));
  const existingAttendees = safeParse<MoveAttendee[]>(localStorage.getItem(ATTENDEES_KEY));

  if (!existingMoves) {
    write(MOVES_KEY, legacyMoves.map((move) => toBackendMove(move, user)));
  }
  if (!existingAttendees) {
    write(ATTENDEES_KEY, seedAttendeesFromMoves(legacyMoves, user));
  }

  return listActiveMoves(profile);
}

export function listActiveMoves(profile: UserProfile): Move[] {
  const user = currentUserShell(profile);
  const moves = read<BackendMove[]>(MOVES_KEY, []);
  const attendees = read<MoveAttendee[]>(ATTENDEES_KEY, []);
  return syncLegacyMoves(moves, attendees, user);
}

export function createMove(move: Move, profile: UserProfile): Move[] {
  const user = currentUserShell(profile);
  const moves = read<BackendMove[]>(MOVES_KEY, []);
  const attendees = read<MoveAttendee[]>(ATTENDEES_KEY, []);
  const now = Date.now();
  const backendMove = toBackendMove(move, user);
  const hostAttendee: MoveAttendee = {
    id: attendeeId(move.id, user.id),
    moveId: move.id,
    userId: user.id,
    status: "joined",
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  const nextMoves = [backendMove, ...moves.filter((m) => m.id !== move.id)];
  const nextAttendees = [
    hostAttendee,
    ...attendees.filter((a) => !(a.moveId === move.id && a.userId === user.id)),
  ];
  write(MOVES_KEY, nextMoves);
  write(ATTENDEES_KEY, nextAttendees);
  return syncLegacyMoves(nextMoves, nextAttendees, user);
}

export function joinMove(moveId: string, profile: UserProfile): Move[] {
  const user = currentUserShell(profile);
  const moves = read<BackendMove[]>(MOVES_KEY, []);
  const attendees = read<MoveAttendee[]>(ATTENDEES_KEY, []);
  const move = moves.find((m) => m.id === moveId);

  if (!move || move.status !== "active" || move.hostApprovalRequired) return syncLegacyMoves(moves, attendees, user);
  if (currentUserJoined(moveId, attendees, user)) return syncLegacyMoves(moves, attendees, user);
  if (activeAttendeeCount(moveId, attendees) >= move.maxSpots) return syncLegacyMoves(moves, attendees, user);

  const now = Date.now();
  const existing = attendees.find((a) => a.moveId === moveId && a.userId === user.id);
  const nextAttendee: MoveAttendee = {
    id: existing?.id ?? attendeeId(moveId, user.id),
    moveId,
    userId: user.id,
    status: "joined",
    joinedAt: existing?.joinedAt ?? now,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const nextAttendees = [
    nextAttendee,
    ...attendees.filter((a) => !(a.moveId === moveId && a.userId === user.id)),
  ];
  write(ATTENDEES_KEY, nextAttendees);
  return syncLegacyMoves(moves, nextAttendees, user);
}

export function leaveMove(moveId: string, profile: UserProfile): Move[] {
  const user = currentUserShell(profile);
  const moves = read<BackendMove[]>(MOVES_KEY, []);
  const attendees = read<MoveAttendee[]>(ATTENDEES_KEY, []);
  const now = Date.now();
  const nextAttendees = attendees.map((attendee) =>
    attendee.moveId === moveId && attendee.userId === user.id && attendee.status === "joined"
      ? { ...attendee, status: "left" as const, leftAt: now, updatedAt: now }
      : attendee,
  );
  write(ATTENDEES_KEY, nextAttendees);
  return syncLegacyMoves(moves, nextAttendees, user);
}

export function cancelMove(moveId: string, profile: UserProfile): Move[] {
  const user = currentUserShell(profile);
  const moves = read<BackendMove[]>(MOVES_KEY, []);
  const attendees = read<MoveAttendee[]>(ATTENDEES_KEY, []);
  const now = Date.now();
  const nextMoves = moves.map((move) =>
    move.id === moveId && move.status === "active"
      ? { ...move, status: "canceled" as const, canceledAt: now, updatedAt: now }
      : move,
  );
  write(MOVES_KEY, nextMoves);
  return syncLegacyMoves(nextMoves, attendees, user);
}
