import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  ChevronLeft, MapPin, Clock, MessageCircle, ShieldAlert, Share2,
  Users, Zap, ChevronRight, LogOut, Heart, Info,
  Dumbbell, Coffee, Utensils, BookOpen, Trophy, Music, Leaf, Mic2,
  Gamepad2, Handshake, Palette, CheckCheck, Footprints, MessageCircleQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRallies, useUser, usePeopleTrust, useJoinRequests } from "@/hooks/useRallies";
import { useToast } from "@/hooks/use-toast";
import { SafetyConcernModal } from "@/components/SafetyConcernModal";
import { LeaveMoveModal } from "@/components/LeaveMoveModal";
import { JoinCommitmentModal } from "@/components/JoinCommitmentModal";
import { AskHostModal } from "@/components/AskHostModal";
import { TrustInfoModal } from "@/components/TrustInfoModal";
import { TrustChip, WarningChip } from "@/components/TrustLabel";
import { CAT_CONFIG, defaultCatConfig } from "@/data/mockData";
import { isLimitedSpots, deriveAttendees, formatShowUpRate } from "@/lib/trust";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const AVATAR_COLORS = [
  "bg-orange-500", "bg-blue-500", "bg-emerald-500",
  "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-cyan-500",
];

const HOST_AVATAR_COLORS: Record<string, string> = {
  "Marcus L.":  "bg-orange-500",
  "Priya S.":   "bg-pink-500",
  "Jordan K.":  "bg-blue-500",
  "Alex T.":    "bg-purple-500",
  "Sofia R.":   "bg-green-500",
  "Devon A.":   "bg-amber-500",
  "Camille D.": "bg-cyan-500",
  "Riley S.":   "bg-emerald-500",
  "Jamie K.":   "bg-rose-500",
};

const CAT_ICONS: Record<string, React.ElementType> = {
  Fitness:    Dumbbell,
  Coffee:     Coffee,
  Food:       Utensils,
  Study:      BookOpen,
  Sports:     Trophy,
  Nightlife:  Music,
  Outdoors:   Leaf,
  Concerts:   Mic2,
  Gaming:     Gamepad2,
  Networking: Handshake,
  Creative:   Palette,
  Errands:    CheckCheck,
  Walking:    Footprints,
};

export default function MoveDetail() {
  const { id } = useParams<{ id: string }>();
  const { rallies, joinRally, leaveRally, cancelMove } = useRallies();
  const { user } = useUser();
  const { getTrust } = usePeopleTrust();
  const { getStatus, requestToJoin } = useJoinRequests();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [askHostOpen, setAskHostOpen] = useState(false);
  const [trustInfoOpen, setTrustInfoOpen] = useState(false);

  const move = rallies.find(r => r.id === id);

  if (!move) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-7 h-7 text-gray-600" strokeWidth={1.5} />
        </div>
        <p className="text-white font-bold mb-2">Move not found</p>
        <Link href="/discover"><span className="text-primary text-sm">← Back to Discover</span></Link>
      </div>
    </div>
  );

  const cat = CAT_CONFIG[move.category] ?? defaultCatConfig;
  const CatIcon = CAT_ICONS[move.category];
  const isLive = move.time === "Now";
  const spotsLeft = move.maxSpots - move.going;
  const fillPct = Math.min(100, (move.going / move.maxSpots) * 100);
  const hostColor = HOST_AVATAR_COLORS[move.hostName] ?? "bg-gray-700";
  const isHost = move.hostName === user.username;
  const hostTrust = getTrust(move.hostName);
  const attendees = deriveAttendees(move).map(a => ({ ...a, trust: getTrust(a.name) ?? a.trust }));
  const requestStatus = getStatus(move.id);

  const confirmJoin = (savedSpot: boolean) => {
    joinRally(move.id);
    setJoinModalOpen(false);
    toast(
      savedSpot
        ? { title: "You're in. Your spot is saved." }
        : { title: "You're in!", description: "Move Chat is now open." }
    );
  };

  const handleJoin = () => {
    if (!move.requiresApproval && isLimitedSpots(move)) {
      setJoinModalOpen(true);
    } else {
      confirmJoin(false);
    }
  };

  // Approval-required Moves: save a pending request instead of joining. Does not
  // join, bump the going count, free/consume a spot, or open Move Chat.
  const handleRequest = () => {
    if (requestToJoin(move)) {
      toast({ title: "Request sent. The host will review it." });
    }
  };

  const handleLeaveConfirm = (reason: { reasonType: string; details: string } | null) => {
    leaveRally(move.id, reason ?? undefined);
    setLeaveOpen(false);
    toast({
      title: reason
        ? "You left the Move. Your reason was sent for review."
        : "You left the Move. Your spot is open again.",
    });
    navigate("/discover");
  };

  const handleCancelConfirm = () => {
    setCancelOpen(false);
    navigate("/discover");
    cancelMove(move.id);
    toast({ title: "Move canceled. The chat is closed." });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] pb-40 relative">

      {/* Hero banner */}
      <div className={cn("h-52 w-full relative overflow-hidden flex items-center justify-center", cat.color)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.04),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        <div className="relative flex flex-col items-center gap-3 z-10">
          {CatIcon
            ? <CatIcon className={cn(cat.text, "drop-shadow-lg")} strokeWidth={1.25} style={{ width: 80, height: 80 }} />
            : <span className="text-7xl drop-shadow-lg">{cat.emoji}</span>
          }
          {isLive && (
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[11px] font-black text-white uppercase tracking-wider">Happening Now</span>
            </div>
          )}
        </div>
      </div>

      {/* Back + Share */}
      <div className="absolute top-0 left-0 right-0 max-w-sm mx-auto px-4 pt-12 z-40 flex items-center justify-between">
        <Link href="/discover">
          <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
        </Link>
        <button
          onClick={() => {
            const url = window.location.href;
            if (navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(url).then(
                () => toast({ title: "Link copied." }),
                () => toast({ title: "Coming soon in the prototype." }),
              );
            } else {
              toast({ title: "Coming soon in the prototype." });
            }
          }}
          aria-label="Share Move"
          className="w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
        >
          <Share2 className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-10 space-y-3">

        {/* Main card */}
        <div className="bg-[#161616] rounded-2xl p-5 border border-white/8 shadow-2xl">

          {/* Category + distance */}
          <div className="flex items-center justify-between mb-3">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold", cat.color, cat.text)}>
              {CatIcon
                ? <CatIcon style={{ width: 12, height: 12 }} strokeWidth={2} />
                : null
              }
              {move.category}
            </span>
            <div className="flex items-center gap-2">
              {move.isCircleMove && (
                <span className="text-[10px] font-black bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full">From Circle</span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <MapPin className="w-3 h-3 text-primary" /> {move.distance}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-black text-white leading-tight mb-4">{move.title}</h1>

          {/* Time + Location */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-gray-200 text-sm">{move.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-gray-200 text-sm">{move.location}</span>
            </div>
          </div>

          {/* Host */}
          <div className="p-3 bg-black/20 rounded-xl border border-white/5 mb-5">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0", hostColor)}>
                {move.hostName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white">
                  {move.hostName}
                  <span className="text-primary ml-2 text-xs">Lv {move.hostLevel}</span>
                </div>
                <div className="text-[11px] text-gray-500">Hosting this Move</div>
              </div>
              <Link href={`/chat/${move.id}`}>
                <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/10 bg-transparent text-gray-300 hover:bg-white/5 text-xs font-bold gap-1">
                  <MessageCircle className="w-3 h-3" /> Message
                </Button>
              </Link>
            </div>
            {hostTrust && (
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-white/5">
                <TrustChip label={hostTrust.trustLabel} />
                {hostTrust.warningLabel && <WarningChip label={hostTrust.warningLabel} />}
                {hostTrust.showUpRate >= 0 && (
                  <span className="text-[11px] text-gray-500 ml-auto">
                    Show-Up Rate <span className="font-bold text-gray-300">{formatShowUpRate(hostTrust.showUpRate)}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Vibe tags */}
          {move.vibeTags.length > 0 && (
            <div className="mb-5">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {move.vibeTags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/8 text-gray-300 rounded-lg text-[11px] font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-5">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">About this Move</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{move.description}</p>
          </div>

          {/* Who's In */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Who's In
              </h3>
              <button
                onClick={() => setTrustInfoOpen(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-primary transition-colors"
              >
                <Info className="w-3 h-3" /> How trust works
              </button>
            </div>

            {/* Attendee trust list */}
            {attendees.length > 0 && (
              <div className="space-y-2 mb-3">
                {attendees.slice(0, 4).map((a, i) => (
                  <div key={`${a.name}-${i}`} className="flex items-center gap-2.5">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0", a.color)}>
                      {a.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-white leading-tight truncate">{a.name}</div>
                      {a.trust.showUpRate >= 0 && (
                        <div className="text-[10px] text-gray-600">Show-Up Rate {formatShowUpRate(a.trust.showUpRate)}</div>
                      )}
                    </div>
                    <div className="ml-auto shrink-0">
                      {a.trust.warningLabel
                        ? <WarningChip label={a.trust.warningLabel} size="xs" />
                        : <TrustChip label={a.trust.trustLabel} size="xs" />}
                    </div>
                  </div>
                ))}
                {move.going > 4 && (
                  <p className="text-[11px] text-gray-600 pl-[42px]">+{move.going - 4} more in</p>
                )}
              </div>
            )}

            {/* Spots progress + accountability */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{move.going} / {move.maxSpots} spots filled</span>
                <span className="text-xs font-bold text-primary">
                  {spotsLeft <= 0 ? "Move is full" : `${spotsLeft} left`}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", spotsLeft <= 2 ? "bg-amber-500" : "bg-primary")} style={{ width: `${fillPct}%` }} />
              </div>
              {!move.joined && spotsLeft > 0 && (
                <p className="text-[11px] text-gray-600 leading-relaxed pt-0.5">
                  Spots are limited. Only tap I'm In if you plan to show — your spot is held for you and
                  could have gone to someone else.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* After the Move? — only when joined */}
        {move.joined && (
          <Link href={`/post-move/${move.id}`}>
            <div className="bg-[#161616] rounded-2xl border border-white/5 p-4 flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-primary" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-primary fill-primary/30" />
                  <span className="text-sm font-black text-white">After the Move?</span>
                </div>
                <p className="text-[11px] text-gray-500">React, add people to your Circle, keep it going.</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
            </div>
          </Link>
        )}

        {/* Pre-Move safety concern */}
        <button onClick={() => setSafetyOpen(true)} className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-gray-700 hover:text-gray-500 transition-colors">
          <ShieldAlert className="w-3 h-3" /> Something feels off
        </button>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto px-4 pb-8 pt-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent z-50 space-y-2">
        {move.joined ? (
          <>
            <Link href={`/chat/${move.id}`}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_20px_rgba(250,204,21,0.35)] flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" /> Open Move Chat
              </Button>
            </Link>
            {isHost ? (
              <button
                onClick={() => setCancelOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-bold text-gray-600 hover:text-red-400 transition-colors"
              >
                Cancel Move
              </button>
            ) : (
              <button
                onClick={() => setLeaveOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-bold text-gray-600 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Leave Move
              </button>
            )}
          </>
        ) : move.requiresApproval ? (
          <>
            {requestStatus === "pending" ? (
              <Button
                disabled
                className="w-full font-black text-base rounded-xl h-14 bg-white/5 text-gray-400 border border-white/8 cursor-not-allowed"
              >
                Request Sent
              </Button>
            ) : (
              <Button
                onClick={handleRequest}
                className="w-full font-black text-base rounded-xl h-14 bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(250,204,21,0.35)]"
              >
                Request to Join
              </Button>
            )}
            <button
              onClick={() => setAskHostOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-bold text-gray-500 hover:text-primary transition-colors"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" /> Ask Host
            </button>
          </>
        ) : (
          <>
            <Button
              onClick={handleJoin}
              disabled={spotsLeft <= 0}
              className={cn(
                "w-full font-black text-base rounded-xl h-14",
                spotsLeft <= 0
                  ? "bg-white/5 text-gray-500 border border-white/8 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(250,204,21,0.35)]"
              )}
            >
              {spotsLeft <= 0 ? "Move is Full" : "I'm In"}
            </Button>
            <button
              onClick={() => setAskHostOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-bold text-gray-500 hover:text-primary transition-colors"
            >
              <MessageCircleQuestion className="w-3.5 h-3.5" /> Ask Host
            </button>
          </>
        )}
      </div>

      {/* Leave Move confirmation (with optional reason) */}
      <LeaveMoveModal
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        onConfirm={handleLeaveConfirm}
      />

      {/* Cancel Move confirmation (host only) */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Cancel this Move?</DialogTitle>
            <DialogDescription className="text-gray-400 leading-relaxed">
              This will close the Move and remove the Move Chat for everyone in the prototype.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 rounded-xl"
              onClick={() => setCancelOpen(false)}
            >
              Keep Move
            </Button>
            <Button
              className="flex-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold rounded-xl"
              onClick={handleCancelConfirm}
            >
              Cancel Move
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <JoinCommitmentModal
        open={joinModalOpen}
        onOpenChange={setJoinModalOpen}
        move={move}
        onConfirm={() => confirmJoin(true)}
      />
      <AskHostModal open={askHostOpen} onOpenChange={setAskHostOpen} moveName={move.title} />
      <TrustInfoModal open={trustInfoOpen} onOpenChange={setTrustInfoOpen} />
      <SafetyConcernModal open={safetyOpen} onOpenChange={setSafetyOpen} moveId={move.id} moveName={move.title} context="preMove" />
    </div>
  );
}
