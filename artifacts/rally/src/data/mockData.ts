export type Rally = {
  id: string;
  title: string;
  category: string;
  distance: string;
  time: string;
  going: number;
  maxSpots: number;
  hostName: string;
  hostLevel: number;
  vibeTags: string[];
  description: string;
  location: string;
  requiresApproval: boolean;
  joined: boolean;
};

export const defaultRallies: Rally[] = [
  {
    id: "r1",
    title: "Leg Day at XSport",
    category: "Fitness",
    distance: "0.8 mi",
    time: "6:00 PM",
    going: 3,
    maxSpots: 8,
    hostName: "Marcus L.",
    hostLevel: 7,
    vibeTags: ["Hype", "Productive"],
    description: "Heavy leg day session at XSport Fitness on Michigan Ave. All levels welcome but bring your A-game.",
    location: "XSport Fitness, Michigan Ave",
    requiresApproval: false,
    joined: false
  },
  {
    id: "r2",
    title: "Sunday Coffee Run",
    category: "Coffee",
    distance: "0.4 mi",
    time: "Now",
    going: 4,
    maxSpots: 6,
    hostName: "Priya S.",
    hostLevel: 3,
    vibeTags: ["Chill", "Social"],
    description: "Grabbing coffee at Intelligentsia on Randolph. Come chat and chill.",
    location: "Intelligentsia Coffee, Randolph St",
    requiresApproval: false,
    joined: false
  },
  {
    id: "r3",
    title: "Pickup Basketball",
    category: "Sports",
    distance: "1.2 mi",
    time: "Now",
    going: 6,
    maxSpots: 10,
    hostName: "Jordan K.",
    hostLevel: 5,
    vibeTags: ["Hype", "Quick Hang"],
    description: "Pickup run at Grant Park courts. Full court. Bring water.",
    location: "Grant Park Basketball Courts",
    requiresApproval: true,
    joined: false
  },
  {
    id: "r4",
    title: "Trivia Team Needed",
    category: "Nightlife",
    distance: "2.1 mi",
    time: "7:30 PM",
    going: 2,
    maxSpots: 4,
    hostName: "Alex T.",
    hostLevel: 4,
    vibeTags: ["Social", "First Timers Welcome"],
    description: "Pub trivia at Longman & Eagle. Need 2 more people to fill the team.",
    location: "Longman & Eagle, Logan Square",
    requiresApproval: false,
    joined: false
  },
  {
    id: "r5",
    title: "Trying a New Taco Spot",
    category: "Food",
    distance: "1.6 mi",
    time: "8:00 PM",
    going: 5,
    maxSpots: 8,
    hostName: "Sofia R.",
    hostLevel: 6,
    vibeTags: ["Chill", "Social"],
    description: "Hitting up the new taco spot in Pilsen. Great reviews, want to check it out with people.",
    location: "Pilsen, Chicago",
    requiresApproval: false,
    joined: false
  }
];

export type UserProfile = {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  bio: string;
  rallyCount: number;
  hostedCount: number;
  friendsCount: number;
  badges: string[];
  interests: string[];
};

export const defaultUserProfile: UserProfile = {
  username: "you_rallier",
  level: 3,
  xp: 340,
  xpToNext: 500,
  bio: "Chicago native. Always down for coffee and hoops.",
  rallyCount: 8,
  hostedCount: 2,
  friendsCount: 14,
  badges: ["Phone Verified", "Early Rallier"],
  interests: []
};

export type Circle = {
  id: string;
  name: string;
  membersCount: number;
  nextRallyTime: string;
  isPublic: boolean;
};

export const defaultCircles: Circle[] = [
  { id: "c1", name: "Sunday Coffee Circle", membersCount: 8, nextRallyTime: "Sunday 9:00 AM", isPublic: true },
  { id: "c2", name: "Chicago Gym Crew", membersCount: 12, nextRallyTime: "Monday 6:30 PM", isPublic: false },
  { id: "c3", name: "Trivia Team", membersCount: 4, nextRallyTime: "Thursday 7:30 PM", isPublic: false },
  { id: "c4", name: "Concert People", membersCount: 21, nextRallyTime: "TBD", isPublic: true },
  { id: "c5", name: "Pickup Basketball Group", membersCount: 15, nextRallyTime: "Saturday 10:00 AM", isPublic: true }
];

export type ChatMessage = {
  id: string;
  rallyId: string;
  senderName: string;
  text: string;
  isMe: boolean;
};

export const mockMessages: Record<string, ChatMessage[]> = {
  "r1": [
    { id: "m1", rallyId: "r1", senderName: "Marcus L.", text: "I'm running 5 minutes late", isMe: false },
    { id: "m2", rallyId: "r1", senderName: "Jordan K.", text: "All good, we're warming up", isMe: false }
  ],
  "r2": [
    { id: "m3", rallyId: "r2", senderName: "Priya S.", text: "Meet near the front entrance", isMe: false }
  ],
  "r3": [
    { id: "m4", rallyId: "r3", senderName: "Jordan K.", text: "Can I bring a friend?", isMe: false },
    { id: "m5", rallyId: "r3", senderName: "Marcus L.", text: "Yeah we need 1 more anyway", isMe: false }
  ]
};
