import { useState, useEffect } from "react";
import {
  defaultMoves, defaultUserProfile,
  Move, UserProfile,
  defaultCircles, Circle,
  ChatMessage, mockMessages,
  ActivityHistoryItem, mockActivityHistory, FeedbackLabel,
  CirclePerson,
  defaultMyCircle, defaultWouldMoveAgain, defaultRecentConnections,
} from "@/data/mockData";

const MOVES_KEY      = "brio_moves";
const USER_KEY       = "brio_user";
const ONBOARDING_KEY = "brio_onboarding";
const MESSAGES_KEY   = "brio_messages";
const HISTORY_KEY    = "brio_history";
const CIRCLE_KEY     = "brio_circle_persons";

export function useRallies() {
  const [rallies, setRallies] = useState<Move[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(MOVES_KEY);
    setRallies(stored ? JSON.parse(stored) : defaultMoves);
    if (!stored) localStorage.setItem(MOVES_KEY, JSON.stringify(defaultMoves));
  }, []);

  const saveMoves  = (m: Move[]) => { setRallies(m); localStorage.setItem(MOVES_KEY, JSON.stringify(m)); };
  const addRally   = (m: Move)   => saveMoves([m, ...rallies]);
  const joinRally  = (id: string) =>
    saveMoves(rallies.map(r => r.id === id ? { ...r, joined: true, going: r.going + 1 } : r));
  const leaveRally = (id: string) =>
    saveMoves(rallies.map(r => r.id === id ? { ...r, joined: false, going: Math.max(0, r.going - 1) } : r));

  return { rallies, addRally, joinRally, leaveRally };
}

export function useUser() {
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migrate stale badge name
      if (parsed.badges?.includes("Early Brio User")) {
        parsed.badges = parsed.badges.map((b: string) => b === "Early Brio User" ? "Early Mover" : b);
        localStorage.setItem(USER_KEY, JSON.stringify(parsed));
      }
      setUser(parsed);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUserProfile));
    }
  }, []);

  const saveUser = (u: UserProfile) => { setUser(u); localStorage.setItem(USER_KEY, JSON.stringify(u)); };
  const updateInterests = (interests: string[]) => saveUser({ ...user, interests });

  return { user, saveUser, updateInterests };
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

  const [state, setState] = useState<CircleState>(() => {
    const stored = localStorage.getItem(CIRCLE_KEY);
    return stored ? JSON.parse(stored) : getDefault();
  });

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
    const storedStr = localStorage.getItem(MESSAGES_KEY);
    const all = storedStr ? JSON.parse(storedStr) : mockMessages;
    if (!storedStr) localStorage.setItem(MESSAGES_KEY, JSON.stringify(mockMessages));
    setMessages(all[moveId] || []);
  }, [moveId]);

  const sendMessage = (text: string) => {
    const msg: ChatMessage = { id: Date.now().toString(), moveId, senderName: "You", text, isMe: true };
    const storedStr = localStorage.getItem(MESSAGES_KEY);
    const all = storedStr ? JSON.parse(storedStr) : {};
    const updated = { ...all, [moveId]: [...(all[moveId] || []), msg] };
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    setMessages(updated[moveId]);
  };

  return { messages, sendMessage };
}

export function useActivityHistory() {
  const [history, setHistory] = useState<ActivityHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) setHistory(JSON.parse(stored));
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
