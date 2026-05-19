import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, UserPlus, Check, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  { id: "s1", name: "Marcus L.", level: 7, rally: "Leg Day at XSport" },
  { id: "s2", name: "Priya S.", level: 3, rally: "Sunday Coffee Run" },
  { id: "s3", name: "Jordan K.", level: 5, rally: "Pickup Basketball" },
  { id: "s4", name: "Alex T.", level: 4, rally: "Trivia Team" },
];

export default function Friends() {
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const toggleAdd = (id: string) => {
    setAdded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-16">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/90 backdrop-blur-md z-40 px-4 h-16 flex items-center border-b border-gray-800">
        <Link href="/profile" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Friends</h1>
      </header>

      <div className="p-4">
        <div className="relative mb-6">
          <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by username" 
            className="w-full bg-[#1a1a1a] border-gray-800 text-white rounded-xl h-12 pl-10"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Suggested from Recent Rallies</h2>
          <div className="space-y-3">
            {SUGGESTIONS.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-700">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{user.name} <span className="text-primary ml-1 text-xs">Lv {user.level}</span></div>
                    <div className="text-xs text-gray-500 truncate max-w-[140px]">{user.rally}</div>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => toggleAdd(user.id)}
                  variant={added[user.id] ? "outline" : "default"}
                  className={`rounded-full h-8 px-3 ${added[user.id] ? 'bg-transparent border-gray-700 text-gray-300' : 'bg-primary text-black hover:bg-primary/90'}`}
                >
                  {added[user.id] ? <><Check className="w-3 h-3 mr-1"/> Pending</> : <><UserPlus className="w-3 h-3 mr-1"/> Add</>}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Your Friends</h2>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={`f${i}`} className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-700">
                    F{i}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">Friend {i} <span className="text-primary ml-1 text-xs">Lv {i+2}</span></div>
                  </div>
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  className="rounded-full h-8 w-8 p-0 bg-transparent border-gray-700 text-gray-300"
                >
                  <MessageCircle className="w-4 h-4"/>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}