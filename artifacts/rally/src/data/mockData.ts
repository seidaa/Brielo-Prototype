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

export const CAT_CONFIG: Record<string, { emoji: string; color: string; border: string; text: string; dot: string }> = {
  Fitness:    { emoji: "💪", color: "bg-orange-500/15", border: "border-orange-500/30", text: "text-orange-400", dot: "bg-orange-400" },
  Coffee:     { emoji: "☕", color: "bg-amber-500/15",  border: "border-amber-500/30",  text: "text-amber-400",  dot: "bg-amber-400" },
  Food:       { emoji: "🍕", color: "bg-green-500/15",  border: "border-green-500/30",  text: "text-green-400",  dot: "bg-green-400" },
  Study:      { emoji: "📚", color: "bg-cyan-500/15",   border: "border-cyan-500/30",   text: "text-cyan-400",   dot: "bg-cyan-400" },
  Sports:     { emoji: "🏀", color: "bg-blue-500/15",   border: "border-blue-500/30",   text: "text-blue-400",   dot: "bg-blue-400" },
  Nightlife:  { emoji: "🎵", color: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  Outdoors:   { emoji: "🌿", color: "bg-emerald-500/15",border: "border-emerald-500/30",text: "text-emerald-400",dot: "bg-emerald-400" },
  Concerts:   { emoji: "🎤", color: "bg-pink-500/15",   border: "border-pink-500/30",   text: "text-pink-400",   dot: "bg-pink-400" },
  Gaming:     { emoji: "🎮", color: "bg-indigo-500/15", border: "border-indigo-500/30", text: "text-indigo-400", dot: "bg-indigo-400" },
  Networking: { emoji: "🤝", color: "bg-slate-500/15",  border: "border-slate-500/30",  text: "text-slate-400",  dot: "bg-slate-400" },
  Creative:   { emoji: "🎨", color: "bg-rose-500/15",   border: "border-rose-500/30",   text: "text-rose-400",   dot: "bg-rose-400" },
  Errands:    { emoji: "✅", color: "bg-gray-500/15",   border: "border-gray-500/30",   text: "text-gray-400",   dot: "bg-gray-400" },
};

export const defaultCatConfig = { emoji: "📍", color: "bg-primary/15", border: "border-primary/30", text: "text-primary", dot: "bg-primary" };

export const defaultRallies: Rally[] = [
  {
    id: "r1",
    title: "Leg Day at XSport",
    category: "Fitness",
    distance: "0.8 mi",
    time: "Now",
    going: 3,
    maxSpots: 8,
    hostName: "Marcus L.",
    hostLevel: 7,
    vibeTags: ["Hype", "Productive"],
    description: "Heavy leg day session at XSport Fitness on Michigan Ave. All levels welcome but bring your A-game. We'll hit squats, leg press, and Romanian deadlifts.",
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
    description: "Grabbing coffee at Intelligentsia on Randolph. Come chat and chill — no agenda, just good convo and better espresso.",
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
    description: "Pickup run at Grant Park courts. Full court. We need 4 more for even teams. Bring water, it's warm out.",
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
    description: "Pub trivia at Longman & Eagle. Need 2 more people to fill the team. We came 2nd last week — let's get that win.",
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
    description: "Hitting up the new taco spot in Pilsen. Great reviews — want to check it out with people and share plates.",
    location: "Pilsen, Chicago",
    requiresApproval: false,
    joined: false
  },
  {
    id: "r6",
    title: "Sunset Run Along Lakefront",
    category: "Outdoors",
    distance: "0.3 mi",
    time: "6:30 PM",
    going: 4,
    maxSpots: 12,
    hostName: "Camille D.",
    hostLevel: 5,
    vibeTags: ["Productive", "Chill"],
    description: "Easy 4-mile run along the lakefront path at sunset. All paces welcome. We'll finish near Navy Pier.",
    location: "Lakefront Trail, Chicago",
    requiresApproval: false,
    joined: false
  },
  {
    id: "r7",
    title: "Jazz at the Green Mill",
    category: "Nightlife",
    distance: "3.0 mi",
    time: "9:00 PM",
    going: 3,
    maxSpots: 6,
    hostName: "Devon A.",
    hostLevel: 8,
    vibeTags: ["Chill", "Social"],
    description: "Live jazz night at The Green Mill. Cover charge is $10. Getting there early to grab seats. Real Chicago vibes.",
    location: "The Green Mill, Uptown",
    requiresApproval: false,
    joined: false
  }
];

export const friendsActivity = [
  { name: "Marcus L.", action: "joined", rallyTitle: "Leg Day at XSport", rallyId: "r1", time: "2m ago" },
  { name: "Priya S.", action: "hosting", rallyTitle: "Sunday Coffee Run", rallyId: "r2", time: "5m ago" },
  { name: "Jordan K.", action: "joined", rallyTitle: "Pickup Basketball", rallyId: "r3", time: "12m ago" },
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
  emoji: string;
};

export const defaultCircles: Circle[] = [
  { id: "c1", name: "Sunday Coffee Circle", membersCount: 8,  nextRallyTime: "Sunday 9:00 AM",   isPublic: true,  emoji: "☕" },
  { id: "c2", name: "Chicago Gym Crew",     membersCount: 12, nextRallyTime: "Monday 6:30 PM",   isPublic: false, emoji: "💪" },
  { id: "c3", name: "Trivia Team",          membersCount: 4,  nextRallyTime: "Thursday 7:30 PM", isPublic: false, emoji: "🧠" },
  { id: "c4", name: "Concert People",       membersCount: 21, nextRallyTime: "TBD",              isPublic: true,  emoji: "🎵" },
  { id: "c5", name: "Pickup Basketball",    membersCount: 15, nextRallyTime: "Saturday 10:00 AM",isPublic: true,  emoji: "🏀" },
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
    { id: "m2", rallyId: "r1", senderName: "Jordan K.", text: "All good, we're warming up", isMe: false },
    { id: "m3", rallyId: "r1", senderName: "Marcus L.", text: "Which entrance are you at?", isMe: false },
  ],
  "r2": [
    { id: "m4", rallyId: "r2", senderName: "Priya S.", text: "Meet near the front entrance", isMe: false },
    { id: "m5", rallyId: "r2", senderName: "Priya S.", text: "I grabbed the corner table 🙌", isMe: false },
  ],
  "r3": [
    { id: "m6", rallyId: "r3", senderName: "Jordan K.", text: "Can I bring a friend?", isMe: false },
    { id: "m7", rallyId: "r3", senderName: "Marcus L.", text: "Yeah we need 1 more anyway", isMe: false },
  ]
};
