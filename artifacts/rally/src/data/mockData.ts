export type Move = {
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
  isCircleMove?: boolean;
};

export const CAT_CONFIG: Record<string, { emoji: string; color: string; border: string; text: string; dot: string }> = {
  Fitness:    { emoji: "💪", color: "bg-orange-500/15", border: "border-orange-500/30", text: "text-orange-400",  dot: "bg-orange-400"  },
  Coffee:     { emoji: "☕", color: "bg-amber-500/15",  border: "border-amber-500/30",  text: "text-amber-400",   dot: "bg-amber-400"   },
  Food:       { emoji: "🍕", color: "bg-green-500/15",  border: "border-green-500/30",  text: "text-green-400",   dot: "bg-green-400"   },
  Study:      { emoji: "📚", color: "bg-cyan-500/15",   border: "border-cyan-500/30",   text: "text-cyan-400",    dot: "bg-cyan-400"    },
  Sports:     { emoji: "🏀", color: "bg-blue-500/15",   border: "border-blue-500/30",   text: "text-blue-400",    dot: "bg-blue-400"    },
  Nightlife:  { emoji: "🎵", color: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-400",  dot: "bg-purple-400"  },
  Outdoors:   { emoji: "🌿", color: "bg-emerald-500/15",border: "border-emerald-500/30",text: "text-emerald-400", dot: "bg-emerald-400" },
  Concerts:   { emoji: "🎤", color: "bg-pink-500/15",   border: "border-pink-500/30",   text: "text-pink-400",    dot: "bg-pink-400"    },
  Gaming:     { emoji: "🎮", color: "bg-indigo-500/15", border: "border-indigo-500/30", text: "text-indigo-400",  dot: "bg-indigo-400"  },
  Networking: { emoji: "🤝", color: "bg-slate-500/15",  border: "border-slate-500/30",  text: "text-slate-400",   dot: "bg-slate-400"   },
  Creative:   { emoji: "🎨", color: "bg-rose-500/15",   border: "border-rose-500/30",   text: "text-rose-400",    dot: "bg-rose-400"    },
  Errands:    { emoji: "✅", color: "bg-gray-500/15",   border: "border-gray-500/30",   text: "text-gray-400",    dot: "bg-gray-400"    },
  Walking:    { emoji: "🚶", color: "bg-teal-500/15",   border: "border-teal-500/30",   text: "text-teal-400",    dot: "bg-teal-400"    },
};

export const defaultCatConfig = { emoji: "📍", color: "bg-primary/15", border: "border-primary/30", text: "text-primary", dot: "bg-primary" };

export const defaultMoves: Move[] = [
  {
    id: "r1", title: "Leg Day at XSport", category: "Fitness", distance: "0.8 mi", time: "Now", going: 3, maxSpots: 8,
    hostName: "Marcus L.", hostLevel: 7, vibeTags: ["Hype", "Productive"],
    description: "Heavy leg day session at XSport Fitness on Michigan Ave. All levels welcome but bring your A-game. We'll hit squats, leg press, and Romanian deadlifts.",
    location: "XSport Fitness, Michigan Ave", requiresApproval: false, joined: false, isCircleMove: true,
  },
  {
    id: "r2", title: "Sunday Coffee Run", category: "Coffee", distance: "0.4 mi", time: "Now", going: 4, maxSpots: 6,
    hostName: "Priya S.", hostLevel: 3, vibeTags: ["Chill", "Social"],
    description: "Grabbing coffee at Intelligentsia on Randolph. Come chat and chill — no agenda, just good convo and better espresso.",
    location: "Intelligentsia Coffee, Randolph St", requiresApproval: false, joined: false, isCircleMove: true,
  },
  {
    id: "r3", title: "Pickup Basketball", category: "Sports", distance: "1.2 mi", time: "Now", going: 6, maxSpots: 10,
    hostName: "Jordan K.", hostLevel: 5, vibeTags: ["Hype", "Quick"],
    description: "Pickup run at Grant Park courts. Full court. We need 4 more for even teams. Bring water, it's warm out.",
    location: "Grant Park Basketball Courts", requiresApproval: true, joined: false, isCircleMove: true,
  },
  {
    id: "r4", title: "Trivia Team Needed", category: "Nightlife", distance: "2.1 mi", time: "7:30 PM", going: 2, maxSpots: 4,
    hostName: "Alex T.", hostLevel: 4, vibeTags: ["Social", "First Timers Welcome"],
    description: "Pub trivia at Longman & Eagle. Need 2 more people to fill the team. We came 2nd last week — let's get that win.",
    location: "Longman & Eagle, Logan Square", requiresApproval: false, joined: false,
  },
  {
    id: "r5", title: "Trying a New Taco Spot", category: "Food", distance: "1.6 mi", time: "8:00 PM", going: 5, maxSpots: 8,
    hostName: "Sofia R.", hostLevel: 6, vibeTags: ["Chill", "Social"],
    description: "Hitting up the new taco spot in Pilsen. Great reviews — want to check it out with people and share plates.",
    location: "Pilsen, Chicago", requiresApproval: false, joined: false,
  },
  {
    id: "r6", title: "Sunset Run Along Lakefront", category: "Outdoors", distance: "0.3 mi", time: "6:30 PM", going: 4, maxSpots: 12,
    hostName: "Camille D.", hostLevel: 5, vibeTags: ["Low Pressure", "Beginner Friendly"],
    description: "Easy 4-mile run along the lakefront path at sunset. All paces welcome. We'll finish near Navy Pier.",
    location: "Lakefront Trail, Chicago", requiresApproval: false, joined: false,
  },
  {
    id: "r7", title: "Jazz at the Green Mill", category: "Nightlife", distance: "3.0 mi", time: "9:00 PM", going: 3, maxSpots: 6,
    hostName: "Devon A.", hostLevel: 8, vibeTags: ["Chill", "Social"],
    description: "Live jazz night at The Green Mill. Cover charge is $10. Getting there early to grab seats. Real Chicago vibes.",
    location: "The Green Mill, Uptown", requiresApproval: false, joined: false,
  },
  {
    id: "r8", title: "Beginner-Friendly Walk", category: "Walking", distance: "0.5 mi", time: "5:00 PM", going: 2, maxSpots: 10,
    hostName: "Riley S.", hostLevel: 2, vibeTags: ["Low Pressure", "First Timers Welcome", "Beginner Friendly"],
    description: "Casual neighborhood walk around Lincoln Park. Great way to meet new people with zero pressure. Bring your dog if you have one!",
    location: "Lincoln Park, Chicago", requiresApproval: false, joined: false,
  },
  {
    id: "r9", title: "Study Session @ Harold's", category: "Study", distance: "0.7 mi", time: "3:00 PM", going: 2, maxSpots: 6,
    hostName: "Jamie K.", hostLevel: 4, vibeTags: ["Productive", "Low Pressure", "Open to New People"],
    description: "Quiet study/work session at Harold Washington Library. Bring headphones, laptop, whatever you're working on.",
    location: "Harold Washington Library, State St", requiresApproval: false, joined: false,
  },
];

export const friendsActivity = [
  { name: "Marcus L.", action: "joined",  moveTitle: "Leg Day at XSport",  moveId: "r1", time: "2m ago"  },
  { name: "Priya S.",  action: "hosting", moveTitle: "Sunday Coffee Run",   moveId: "r2", time: "5m ago"  },
  { name: "Jordan K.", action: "joined",  moveTitle: "Pickup Basketball",   moveId: "r3", time: "12m ago" },
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
  username: "you_brio",
  level: 3,
  xp: 340,
  xpToNext: 500,
  bio: "Chicago native. Always down for coffee and hoops.",
  rallyCount: 8,
  hostedCount: 2,
  friendsCount: 14,
  badges: ["Early Mover", "Shows Up"],
  interests: [],
};

// ── Circle Person — the new person-based Circle concept ──────────────────────
export type CirclePerson = {
  id: string;
  name: string;
  initials: string;
  color: string;
  level: number;
  lastMove: string;
  lastMoveId: string;
  mutualMoves: number;
  inCircle: boolean;
  wouldMoveAgain?: boolean;
};

export const defaultMyCircle: CirclePerson[] = [
  { id: "cp1", name: "Marcus L.", initials: "ML", color: "bg-orange-500", level: 7, lastMove: "Leg Day at XSport",   lastMoveId: "r1", mutualMoves: 3, inCircle: true  },
  { id: "cp2", name: "Jordan K.", initials: "JK", color: "bg-blue-500",   level: 5, lastMove: "Pickup Basketball",  lastMoveId: "r3", mutualMoves: 4, inCircle: true  },
  { id: "cp3", name: "Priya S.",  initials: "PS", color: "bg-pink-500",   level: 3, lastMove: "Sunday Coffee Run",  lastMoveId: "r2", mutualMoves: 2, inCircle: true  },
];

export const defaultWouldMoveAgain: CirclePerson[] = [
  { id: "cp4", name: "Sofia R.",  initials: "SR", color: "bg-green-500",  level: 6, lastMove: "Taco Spot in Pilsen", lastMoveId: "r5", mutualMoves: 1, inCircle: false, wouldMoveAgain: true },
  { id: "cp5", name: "Devon A.",  initials: "DA", color: "bg-amber-500",  level: 8, lastMove: "Jazz at Green Mill",  lastMoveId: "r7", mutualMoves: 1, inCircle: false, wouldMoveAgain: true },
  { id: "cp6", name: "Alex T.",   initials: "AT", color: "bg-purple-500", level: 4, lastMove: "Trivia Night",         lastMoveId: "r4", mutualMoves: 1, inCircle: false, wouldMoveAgain: true },
];

export const defaultRecentConnections: CirclePerson[] = [
  { id: "cp7", name: "Riley S.",   initials: "RS", color: "bg-emerald-500", level: 2, lastMove: "Beginner-Friendly Walk", lastMoveId: "r8", mutualMoves: 1, inCircle: false },
  { id: "cp8", name: "Jamie K.",   initials: "JK", color: "bg-cyan-500",    level: 4, lastMove: "Study Session",           lastMoveId: "r9", mutualMoves: 1, inCircle: false },
  { id: "cp9", name: "Camille D.", initials: "CD", color: "bg-teal-500",    level: 5, lastMove: "Sunset Run",              lastMoveId: "r6", mutualMoves: 2, inCircle: false },
];

// ── Group Circles (kept for circle-detail + discovery) ───────────────────────
export type Circle = {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  nextMoveTime: string;
  schedule: string;
  isPublic: boolean;
  emoji: string;
  description: string;
};

export const defaultCircles: Circle[] = [
  { id: "c1", name: "Sunday Coffee Circle",     category: "Coffee",    membersCount: 8,  nextMoveTime: "Sun 9:00 AM",  schedule: "Every Sunday",    isPublic: true,  emoji: "☕", description: "Weekly coffee ritual. Good people, no agenda." },
  { id: "c2", name: "Chicago Gym Circle",       category: "Fitness",   membersCount: 12, nextMoveTime: "Mon 6:30 PM",  schedule: "Mon / Wed / Fri", isPublic: false, emoji: "💪", description: "Accountability crew for the gym. Push each other." },
  { id: "c3", name: "Trivia Circle",            category: "Nightlife", membersCount: 4,  nextMoveTime: "Thu 7:30 PM",  schedule: "Every Thursday",  isPublic: false, emoji: "🧠", description: "Weekly pub trivia team at Longman & Eagle." },
  { id: "c4", name: "Concert Circle",           category: "Concerts",  membersCount: 21, nextMoveTime: "TBD",          schedule: "As shows come up", isPublic: true, emoji: "🎵", description: "People who actually go to shows, not just save Spotify." },
  { id: "c5", name: "Pickup Basketball Circle", category: "Sports",    membersCount: 15, nextMoveTime: "Sat 10:00 AM", schedule: "Every Saturday",  isPublic: true,  emoji: "🏀", description: "Full-court pickup at Grant Park. All skill levels." },
  { id: "c6", name: "Foodie Circle",            category: "Food",      membersCount: 9,  nextMoveTime: "Fri 7:00 PM",  schedule: "Every other Fri", isPublic: true,  emoji: "🍕", description: "Rotating dinner spots around Chicago neighborhoods." },
  { id: "c7", name: "Study Circle",             category: "Study",     membersCount: 6,  nextMoveTime: "Wed 2:00 PM",  schedule: "Every Wednesday", isPublic: true,  emoji: "📚", description: "Co-working and study sessions. Bring your focus." },
  { id: "c8", name: "Walking Circle",           category: "Walking",   membersCount: 11, nextMoveTime: "Sat 8:00 AM",  schedule: "Every Saturday",  isPublic: true,  emoji: "🚶", description: "Morning walks around different Chicago neighborhoods." },
];

export type ChatMessage = {
  id: string;
  moveId: string;
  senderName: string;
  text: string;
  isMe: boolean;
};

export const mockMessages: Record<string, ChatMessage[]> = {
  r1: [
    { id: "m1", moveId: "r1", senderName: "Marcus L.", text: "I'm running 5 minutes late", isMe: false },
    { id: "m2", moveId: "r1", senderName: "Jordan K.", text: "All good, we're warming up", isMe: false },
    { id: "m3", moveId: "r1", senderName: "Marcus L.", text: "Which entrance are you at?", isMe: false },
  ],
  r2: [
    { id: "m4", moveId: "r2", senderName: "Priya S.", text: "Meet near the front entrance", isMe: false },
    { id: "m5", moveId: "r2", senderName: "Priya S.", text: "I grabbed the corner table 🙌", isMe: false },
  ],
  r3: [
    { id: "m6", moveId: "r3", senderName: "Jordan K.", text: "Can I bring a friend?", isMe: false },
    { id: "m7", moveId: "r3", senderName: "Marcus L.", text: "Yeah we need 1 more anyway", isMe: false },
  ],
};

export type FeedbackLabel = "Good vibes" | "Would do again" | "No-show" | "Felt off";

export type ActivityHistoryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  role: "hosted" | "attended";
  attendeeCount: number;
  tags: ("Recurring" | "Circle Move")[];
  feedback?: FeedbackLabel;
};

export const mockActivityHistory: ActivityHistoryItem[] = [
  { id: "h1", title: "Sunday Coffee Run",     category: "Coffee",    date: "May 18", role: "hosted",   attendeeCount: 4, tags: ["Recurring"],   feedback: "Good vibes"     },
  { id: "h2", title: "Tuesday Trivia Circle", category: "Nightlife", date: "May 13", role: "attended", attendeeCount: 6, tags: [],              feedback: "Would do again" },
  { id: "h3", title: "Weekly Gym Session",    category: "Fitness",   date: "May 12", role: "attended", attendeeCount: 3, tags: ["Circle Move"], feedback: "Good vibes"     },
  { id: "h4", title: "Pickup Basketball",     category: "Sports",    date: "May 10", role: "hosted",   attendeeCount: 8, tags: [],              feedback: "Would do again" },
  { id: "h5", title: "Jazz at the Green Mill",category: "Nightlife", date: "May 5",  role: "attended", attendeeCount: 5, tags: []                                           },
  { id: "h6", title: "Lakefront Sunset Run",  category: "Outdoors",  date: "Apr 29", role: "attended", attendeeCount: 7, tags: ["Recurring"],   feedback: "Good vibes"     },
  { id: "h7", title: "Board Games Night",     category: "Gaming",    date: "Apr 22", role: "hosted",   attendeeCount: 5, tags: ["Circle Move"], feedback: "Would do again" },
];
