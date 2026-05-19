import { useState, useEffect } from "react";
import { defaultRallies, defaultUserProfile, Rally, UserProfile, defaultCircles, Circle, ChatMessage, mockMessages } from "@/data/mockData";

const RALLIES_KEY = "rally_rallies";
const USER_KEY = "rally_user";
const ONBOARDING_KEY = "rally_onboarding";
const MESSAGES_KEY = "rally_messages";

export function useRallies() {
  const [rallies, setRallies] = useState<Rally[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(RALLIES_KEY);
    if (stored) {
      setRallies(JSON.parse(stored));
    } else {
      setRallies(defaultRallies);
      localStorage.setItem(RALLIES_KEY, JSON.stringify(defaultRallies));
    }
  }, []);

  const saveRallies = (newRallies: Rally[]) => {
    setRallies(newRallies);
    localStorage.setItem(RALLIES_KEY, JSON.stringify(newRallies));
  };

  const addRally = (rally: Rally) => {
    saveRallies([rally, ...rallies]);
  };

  const joinRally = (id: string) => {
    saveRallies(
      rallies.map((r) => {
        if (r.id === id) {
          return { ...r, joined: true, going: r.going + 1 };
        }
        return r;
      })
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
  return { circles: defaultCircles };
}

export function useMessages(rallyId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const storedStr = localStorage.getItem(MESSAGES_KEY);
    let allMessages = storedStr ? JSON.parse(storedStr) : mockMessages;
    if (!storedStr) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(mockMessages));
    }
    
    setMessages(allMessages[rallyId] || []);
  }, [rallyId]);

  const sendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      rallyId,
      senderName: "You",
      text,
      isMe: true
    };
    
    const storedStr = localStorage.getItem(MESSAGES_KEY);
    const allMessages = storedStr ? JSON.parse(storedStr) : {};
    
    const updatedRallyMessages = [...(allMessages[rallyId] || []), newMessage];
    const updatedAll = { ...allMessages, [rallyId]: updatedRallyMessages };
    
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedAll));
    setMessages(updatedRallyMessages);
  };

  return { messages, sendMessage };
}
