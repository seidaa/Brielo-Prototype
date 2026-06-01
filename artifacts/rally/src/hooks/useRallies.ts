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

const MOVES_KEY      = "brio_moves";
const USER_KEY       = "brio_user";
const ONBOARDING_KEY = "brio_onboarding";
const MESSAGES_KEY   = "brio_messages";
const HISTORY_KEY    = "brio_history";
const CIRCLE_KEY     = "brio_circle_persons";
const PEOPLE_TRUST_KEY = "brio_people_trust";

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

export function useRallies() {
  const [rallies, setRallies] = useState<Move[]>([]);

  useEffect(() => {
    const parsed = safeParse<Move[]>(localStorage.getItem(MOVES_KEY));
    setRallies(parsed ?? defaultMoves);
    if (!parsed) localStorage.setItem(MOVES_KEY, JSON.stringify(defaultMoves));
  }, []);

  const saveMoves  = (m: Move[]) => { setRallies(m); localStorage.setItem(MOVES_KEY, JSON.stringify(m)); };
  const addRally   = (m: Move)   => saveMoves([m, ...rallies]);
  const joinRally  = (id: string) =>
    saveMoves(rallies.map(r => r.id === id ? { ...r, joined: true, going: r.going + 1 } : r));
  const leaveRally = (id: string) =>
    saveMoves(rallies.map(r => r.id === id ? { ...r, joined: false, going: Math.max(0, r.going - 1) } : r));
  // Host closes a Move they created: fully remove it so it stops appearing on every
  // active surface (Discover, Live Moves Nearby, Live Map, Profile, Move Chat list,
  // chat badge). This is NOT a no-show or trust penalty — past Activity History lives
  // in a separate store (HISTORY_KEY) and is untouched.
  const cancelMove = (id: string) =>
    saveMoves(rallies.filter(r => r.id !== id));

  return { rallies, addRally, joinRally, leaveRally, cancelMove };
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

// ── Show-Up Trust for other people (Phase 1 prototype) ───────────────────────
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
