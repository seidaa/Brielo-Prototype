import { Link } from "wouter";
import { ChevronLeft, Users, Calendar, Lock, Globe } from "lucide-react";
import { useCircles } from "@/hooks/useRallies";
import { Badge } from "@/components/ui/badge";

export default function Circles() {
  const { circles } = useCircles();

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-24 pt-16">
      <header className="fixed top-0 left-0 right-0 max-w-sm mx-auto bg-[#0d0d0d]/90 backdrop-blur-md z-40 px-4 h-16 flex items-center border-b border-gray-800">
        <Link href="/profile" className="mr-4">
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white">Your Circles</h1>
      </header>

      <div className="p-4 space-y-4">
        {circles.map(circle => (
          <Link key={circle.id} href={`/circles/${circle.id}`}>
            <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold text-white leading-tight">{circle.name}</h2>
                <Badge variant="outline" className={`rounded-full border-gray-700 flex items-center gap-1 ${circle.isPublic ? 'text-green-400' : 'text-orange-400'}`}>
                  {circle.isPublic ? <Globe className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
                  {circle.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {circle.membersCount} members
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <Calendar className="w-4 h-4" /> Next: {circle.nextRallyTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}