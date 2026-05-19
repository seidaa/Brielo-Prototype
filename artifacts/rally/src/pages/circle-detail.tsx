import { Link, useParams } from "wouter";
import { ChevronLeft, Plus, Users, Calendar, Lock, Globe } from "lucide-react";
import { useCircles } from "@/hooks/useRallies";
import { Button } from "@/components/ui/button";

export default function CircleDetail() {
  const { id } = useParams<{ id: string }>();
  const { circles } = useCircles();
  const circle = circles.find(c => c.id === id);

  if (!circle) return <div className="p-8 text-white">Circle not found.</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-16">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/90 backdrop-blur-md z-40 px-4 h-16 flex items-center border-b border-gray-800">
        <Link href="/circles" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-base font-bold text-white truncate flex-1">{circle.name}</h1>
      </header>

      <div className="p-4 space-y-6">
        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 mx-auto flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{circle.name}</h2>
          <div className="flex justify-center items-center gap-3 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {circle.membersCount} members</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {circle.isPublic ? <Globe className="w-4 h-4"/> : <Lock className="w-4 h-4"/>} 
              {circle.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Upcoming Rallies</h3>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 text-center">
            <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-white">No scheduled rallies</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to schedule one for this circle.</p>
            <Button className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Create Circle Rally
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Members</h3>
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 divide-y divide-gray-800">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold border border-gray-700">
                  U{i}
                </div>
                <div className="font-bold text-white text-sm">User {i+1}</div>
                {i === 0 && <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">ADMIN</span>}
              </div>
            ))}
            <div className="p-3 text-center text-sm font-bold text-gray-400 hover:text-white cursor-pointer">
              View all {circle.membersCount} members
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}