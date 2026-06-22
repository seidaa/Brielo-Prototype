import { useState, useEffect } from "react";
import {
  defaultMoves, defaultUserProfile,
  Move, UserProfile,
  defaultCircles, Circle,
  ChatMessage, mockMessages,
  ActivityHistoryItem, mockActivityHistory, FeedbackLabel,
  CirclePerson,
  defaultMyCircle, defaultWouldMoveAgain, defaultRecentConnections,
  PersonTrust, PEOPLE_TRUST,
} from "@/data/mockData";
import { computeShowUpRate, computeWarning } from "@/lib/trust";
import {
  pushNotification, getNotifications, markAllNotificationsRead,
  AppNotification, NOTIF_EVENT,
} from "@/lib/notifications";
import { saveLeaveReason } from "@/lib/leaveReasons";
import {
  cancelMove as cancelPhase1Move,
  createMove,
  initializePhase1Storage,
  joinMove,
  leaveMove,
  listActiveMoves,
} from "@/lib/backendPhase1";

const MOVES_KEY      = "brio_moves";
const USER_KEY       = "brio_user";
const ONBOARDING_KEY = "brio_onboarding";
const MESSAGES_KEY   = "brio_messages";
const HISTORY_KEY    = "brio_history";
const CIRCLE_KEY     = "brio_circle_persons";
const PEOPLE_TRUST_KEY = "brio_people_trust";
const JOIN_REQUESTS_KEY = "brio_join_requests";

// Window event so any mounted view (a card's button, the Move detail CTA) updates
// the moment a request is sent — mirrors the notifications store pattern.
export const JOIN_REQUESTS_EVENT = "brio:join-requests";

// Safely parse a localStorage value. Returns null when the key is empty or holds
// corrupted JSON, so a single bad entry can never white-screen the prototype —
// callers fall back to their defaults and the value self-heals on the next write.
function safeParse<T>(raw: string | null): T | null {
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readCurrentUserProfile(): UserProfile {
  return safeParse<UserProfile>(localStorage.getItem(USER_KEY)) ?? defaultUserProfile;
}

export function useRallies() {
  const [rallies, setRallies] = useState<Move[]>([]);

  useEffect(() => {
    setRallies(initializePhase1Storage(defaultMoves, readCurrentUserProfile()));
  }, []);

  const addRally   = (m: Move)   => {
    setRallies(createMove(m, readCurrentUserProfile()));
    pushNotification("create", `Your Move is live: ${m.title}.`);
  };
  const joinRally  = (id: string) => {
    const before = rallies.find(r => r.id === id) ?? listActiveMoves(readCurrentUserProfile()).find(r => r.id === id);
    const updated = joinMove(id, readCurrentUserProfile());
    const after = updated.find(r => r.id === id);
    setRallies(updated);
    if (before && after?.joined && !before.joined) {
      pushNotification("join", `Your spot is saved for ${before.title}.`);
    }
  };
  // Leaving a Move is always easy and fair — never a no-show, never a trust
  // penalty. An optional reason can be attached; if provided it is saved to a
  // private moderation-facing store and a separate "sent for review" notification
  // is added on top of the normal "your spot is open again" one.
  const leaveRally = (id: string, reason?: { reasonType: string; details: string }) => {
    const move = rallies.find(r => r.id === id) ?? listActiveMoves(readCurrentUserProfile()).find(r => r.id === id);
    setRallies(leaveMove(id, readCurrentUserProfile()));
    if (move) {
      pushNotification("leave", `You left ${move.title}. Your spot is open again.`);
      if (reason && (reason.reasonType || reason.details)) {
        saveLeaveReason({ moveId: move.id, moveName: move.title, reasonType: reason.reasonType, details: reason.details });
        pushNotification("report", `Your reason for leaving ${move.title} was sent for review.`);
      }
    }
  };
  // Host closes a Move they created: fully remove it so it stops appearing on every
  // active surface (Discover, Live Moves Nearby, Live Map, Profile, Move Chat list,
  // chat badge). This is NOT a no-show or trust penalty — past Activity History lives
  // in a separate store (HISTORY_KEY) and is untouched.
  const cancelMove = (id: string) => {
    const move = rallies.find(r => r.id === id) ?? listActiveMoves(readCurrentUserProfile()).find(r => r.id === id);
    setRallies(cancelPhase1Move(id, readCurrentUserProfile()));
    if (move) pushNotification("cancel", `${move.title} was canceled. The chat is closed.`);
  };

  return { rallies, addRally, joinRally, leaveRally, cancelMove };
}

// Prototype notification feed. Reads the localStorage store on mount and stays in
// sync via the NOTIF_EVENT window event, so the bell dot and drawer update live the
// moment an action fires — even within the same screen, no navigation required.
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const refresh = () => setNotifications(getNotifications());
    refresh();
    window.addEventListener(NOTIF_EVENT, refresh);
    return () => window.removeEventListener(NOTIF_EVENT, refresh);
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAllRead: markAllNotificationsRead,
  };
}

// Prototype host-approval flow. On approval-required Moves, "Request to Join" saves
// a pending request here instead of joining — it does NOT touch the Move's going
// count, spots, joined flag, or Move Chat. Approval is intentionally not automated
// in this pass: a request simply stays pending until a future host-review feature.
export type JoinRequestStatus = "pending" | "approved" | "declined";

export interface JoinRequest {
  id: string;
  moveId: string;
  moveName: string;
  requesterName: string;
  status: JoinRequestStatus;
  createdAt: number;
}

function readJoinRequests(): JoinRequest[] {
  return safeParse<JoinRequest[]>(localStorage.getItem(JOIN_REQUESTS_KEY)) ?? [];
}

export function useJoinRequests() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);

  useEffect(() => {
    const refresh = () => setRequests(readJoinRequests());
    refresh();
    window.addEventListener(JOIN_REQUESTS_EVENT, refresh);
    return () => window.removeEventListener(JOIN_REQUESTS_EVENT, refresh);
  }, []);

  // Prefer an in-flight pending request; otherwise fall back to the newest record
  // so the CTA never reflects a stale approved/declined entry over a fresh pending.
  const getStatus = (moveId: string): JoinRequestStatus | undefined => {
    const matches = requests.filter(r => r.moveId === moveId);
    if (matches.length === 0) return undefined;
    const pending = matches.find(r => r.status === "pending");
    if (pending) return pending.status;
    return matches.reduce((a, b) => (b.createdAt > a.createdAt ? b : a)).status;
  };

  // Returns false if a request for this Move is already in flight, so callers can
  // skip the duplicate toast/notification.
  const requestToJoin = (move: { id: string; title: string }): boolean => {
    const existing = readJoinRequests();
    if (existing.some(r => r.moveId === move.id && r.status === "pending")) return false;
    const u = safeParse<UserProfile>(localStorage.getItem(USER_KEY));
    const req: JoinRequest = {
      id: "jr_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      moveId: move.id,
      moveName: move.title,
      requesterName: u?.username ?? "You",
      status: "pending",
      createdAt: Date.now(),
    };
    localStorage.setItem(JOIN_REQUESTS_KEY, JSON.stringify([...existing, req]));
    window.dispatchEvent(new Event(JOIN_REQUESTS_EVENT));
    pushNotification("request", `Request sent for ${move.title}.`);
    return true;
  };

  return { requests, getStatus, requestToJoin };
}

export function useUser() {
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    const parsed = safeParse<any>(localStorage.getItem(USER_KEY));
    if (parsed) {
      // Migrate stale badge name
      if (parsed.badges?.includes("Early Brio User")) {
        parsed.badges = parsed.badges.map((b: string) => b === "Early Brio User" ? "Early Mover" : b);
      }
      // Merge in any newly added defaults (e.g. trust fields) for existing users
      const merged: UserProfile = { ...defaultUserProfile, ...parsed };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      setUser(merged);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUserProfile));
    }
  }, []);

  const saveUser = (u: UserProfile) => { setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); };
  const updateInterests = (interests: string[]) => saveUser({ ...user, interests });
  const setMissNote = (note: string) => saveUser({ ...user, missNote: note.trim() || undefined });

  return { user, saveUser, updateInterests, setMissNote };
}

export function useOnboarding() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() =>
    localStorage.getItem(ONBOARDING_KEY) === "true"
  );
  const completeOnboarding = () => { setIsOnboarded(true); localStorage.setItem(ONBOARDING_KEY, "true"); };
  return { isOnboarded, completeOnboarding };
}

export function useCircles() {
  return { circles: defaultCircles };
}

export function useCirclePersons() {
  type CircleState = {
    myCircle: CirclePerson[];
    wouldMoveAgain: CirclePerson[];
    recentConnections: CirclePerson[];
  };

  const getDefault = (): CircleState => ({
    myCircle: defaultMyCircle,
    wouldMoveAgain: defaultWouldMoveAgain,
    recentConnections: defaultRecentConnections,
  });

  const [state, setState] = useState<CircleState>(() =>
    safeParse<CircleState>(localStorage.getItem(CIRCLE_KEY)) ?? getDefault()
  );

  const save = (s: CircleState) => {
    setState(s);
    localStorage.setItem(CIRCLE_KEY, JSON.stringify(s));
  };

  const addToCircle = (personId: string) => {
    const updatePerson = (p: CirclePerson) =>
      p.id === personId ? { ...p, inCircle: true } : p;

    const moved: CirclePerson[] = [];
    const newWould  = state.wouldMoveAgain.filter(p => {
      if (p.id === personId) { moved.push({ ...p, inCircle: true }); return false; }
      return true;
    });
    const newRecent = state.recentConnections.filter(p => {
      if (p.id === personId) { moved.push({ ...p, inCircle: true }); return false; }
      return true;
    });

    save({
      myCircle: [
        ...state.myCircle.map(updatePerson),
        ...moved.filter(m => !state.myCircle.find(c => c.id === m.id)),
      ],
      wouldMoveAgain: newWould,
      recentConnections: newRecent,
    });
  };

  const markWouldMoveAgain = (personId: string) => {
    const target = state.recentConnections.find(p => p.id === personId);
    if (!target) return;
    save({
      ...state,
      wouldMoveAgain: [...state.wouldMoveAgain, { ...target, wouldMoveAgain: true }],
      recentConnections: state.recentConnections.filter(p => p.id !== personId),
    });
  };

  return {
    myCircle: state.myCircle,
    wouldMoveAgain: state.wouldMoveAgain,
    recentConnections: state.recentConnections,
    addToCircle,
    markWouldMoveAgain,
  };
}

export function useMessages(moveId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const parsed = safeParse<Record<string, ChatMessage[]>>(localStorage.getItem(MESSAGES_KEY));
    const all = parsed ?? mockMessages;
    if (!parsed) localStorage.setItem(MESSAGES_KEY, JSON.stringify(mockMessages));
    setMessages(all[moveId] || []);
  }, [moveId]);

  const sendMessage = (text: string) => {
    const msg: ChatMessage = { id: Date.now().toString(), moveId, senderName: "You", text, isMe: true };
    const all = safeParse<Record<string, ChatMessage[]>>(localStorage.getItem(MESSAGES_KEY)) ?? {};
    const updated = { ...all, [moveId]: [...(all[moveId] || []), msg] };
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    setMessages(updated[moveId]);
  };

  return { messages, sendMessage };
}

export function useActivityHistory() {
  const [history, setHistory] = useState<ActivityHistoryItem[]>([]);

  useEffect(() => {
    const parsed = safeParse<ActivityHistoryItem[]>(localStorage.getItem(HISTORY_KEY));
    if (parsed) setHistory(parsed);
    else { setHistory(mockActivityHistory); localStorage.setItem(HISTORY_KEY, JSON.stringify(mockActivityHistory)); }
  }, []);

  const setFeedback = (id: string, feedback: FeedbackLabel) => {
    setHistory(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, feedback } : item);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    history,
    setFeedback,
    attendedCount: history.filter(h => h.role === "attended").length,
    hostedCount:   history.filter(h => h.role === "hosted").length,
    circleCount:   history.filter(h => h.tags.includes("Circle Move")).length,
  };
}

// ── Show-Up Trust for other people (Phase 1 prototype) ──────────────────────
// Reads from the shared PEOPLE_TRUST defaults, layering any locally-stored
// overrides created by After-the-Move feedback. Feedback the user gives is
// private and only nudges trust signals — it never permanently marks anyone.
export type FeedbackImpact = "no-show" | "would-again" | "good-vibes";

export function usePeopleTrust() {
  const [overrides, setOverrides] = useState<Record<string, PersonTrust>>({});

  useEffect(() => {
    const parsed = safeParse<Record<string, PersonTrust>>(localStorage.getItem(PEOPLE_TRUST_KEY));
    if (parsed) setOverrides(parsed);
  }, []);

  const getTrust = (name: string): PersonTrust | undefined =>
    overrides[name] ?? PEOPLE_TRUST[name];

  // `apply` true adds the signal; false reverts it. Keeping this symmetric means
  // toggling feedback off in the UI never leaves a stacked or stranded trust
  // mutation behind in localStorage.
  const recordFeedback = (name: string, type: FeedbackImpact, apply = true) => {
    const base = overrides[name] ?? PEOPLE_TRUST[name];
    if (!base) return;
    const dir = apply ? 1 : -1;
    const next: PersonTrust = { ...base };
    if (type === "no-show") {
      next.movesMissed = Math.max(0, base.movesMissed + dir);
      next.showUpRate  = computeShowUpRate(base.movesAttended, next.movesMissed);
      // Fairness: one miss is not permanent — the positive trust label stays put;
      // a warning only surfaces once a pattern of recent misses appears.
      next.warningLabel = computeWarning(next);
    } else if (type === "would-again") {
      next.wouldMoveAgainCount = Math.max(0, base.wouldMoveAgainCount + dir);
    } else if (type === "good-vibes") {
      next.goodVibesCount = Math.max(0, base.goodVibesCount + dir);
    }
    const updated = { ...overrides, [name]: next };
    setOverrides(updated);
    localStorage.setItem(PEOPLE_TRUST_KEY, JSON.stringify(updated));
  };

  return { getTrust, recordFeedback };
}
