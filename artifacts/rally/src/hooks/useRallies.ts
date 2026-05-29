import { useState, useEffect } from "react";
import {
  defaultMoves, defaultUserProfile,
  Move, UserProfile,
  defaultCrews, Crew,
  ChatMessage, mockMessages,
  ActivityHistoryItem, mockActivityHistory, FeedbackLabel,
} from "@/data/mockData";

const MOVES_KEY    = "brio_moves";
const USER_KEY     = "brio_user";
const ONBOARDING_KEY = "brio_onboarding";
const MESSAGES_KEY = "brio_messages";
const HISTORY_KEY  = "brio_history";

export function useRallies() {
  const [rallies, setRallies] = useState<Move[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(MOVES_KEY);
    if (stored) {
      setRallies(JSON.parse(stored));
    } else {
      setRallies(defaultMoves);
      localStorage.setItem(MOVES_KEY, JSON.stringify(defaultMoves));
    }
  }, []);

  const saveMoves = (newMoves: Move[]) => {
    setRallies(newMoves);
    localStorage.setItem(MOVES_KEY, JSON.stringify(newMoves));
  };

  const addRally = (move: Move) => {
    saveMoves([move, ...rallies]);
  };

  const joinRally = (id: string) => {
    saveMoves(
      rallies.map((r) =>
        r.id === id ? { ...r, joined: true, going: r.going + 1 } : r
      )
    );
  };

  return { rallies, addRally, joinRally };
}

export function useUser() {
  const [user, setUser] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUserProfile));
    }
  }, []);

  const saveUser = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const updateInterests = (interests: string[]) => {
    saveUser({ ...user, interests });
  };

  return { user, saveUser, updateInterests };
}

export function useOnboarding() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  });

  const completeOnboarding = () => {
    setIsOnboarded(true);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  return { isOnboarded, completeOnboarding };
}

export function useCircles() {
  return { circles: defaultCrews };
}

export function useMessages(moveId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const storedStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages = storedStr ? JSON.parse(storedStr) : mockMessages;
    if (!storedStr) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(mockMessages));
    }
    setMessages(allMessages[moveId] || []);
  }, [moveId]);

  const sendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      moveId,
      senderName: "You",
      text,
      isMe: true,
    };

    const storedStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages = storedStr ? JSON.parse(storedStr) : {};
    const updatedMoveMessages = [...(allMessages[moveId] || []), newMessage];
    const updatedAll = { ...allMessages, [moveId]: updatedMoveMessages };
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedAll));
    setMessages(updatedMoveMessages);
  };

  return { messages, sendMessage };
}

export function useActivityHistory() {
  const [history, setHistory] = useState<ActivityHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      setHistory(mockActivityHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(mockActivityHistory));
    }
  }, []);

  const setFeedback = (id: string, feedback: FeedbackLabel) => {
    setHistory(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, feedback } : item
      );
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const attendedCount = history.filter(h => h.role === "attended").length;
  const hostedCount   = history.filter(h => h.role === "hosted").length;
  const crewCount     = history.filter(h => h.tags.includes("Crew Move")).length;

  return { history, setFeedback, attendedCount, hostedCount, crewCount };
}
