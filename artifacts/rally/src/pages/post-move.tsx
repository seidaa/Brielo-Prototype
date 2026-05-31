import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import {
  ChevronLeft, ChevronRight, Check, ArrowRight, X,
  Sparkles, RefreshCw, CheckCircle2, Minus, UserX, Star, Feather, Heart,
  Zap, Smartphone, UsersRound, AlertTriangle, AlertCircle, ShieldAlert, Trash2, MoreHorizontal,
  Dumbbell, Coffee, Utensils, BookOpen, Trophy, Music, Leaf, Mic2,
  Gamepad2, Handshake, Palette, CheckCheck, Footprints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRallies, useCirclePersons } from "@/hooks/useRallies";
import { CAT_CONFIG, defaultCatConfig } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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

type Reaction = { id: string; label: string; Icon: React.ElementType };
const REACTIONS: Reaction[] = [
  { id: "good-vibes",    label: "Good vibes",       Icon: Sparkles      },
  { id: "would-again",  label: "Would move again",  Icon: RefreshCw     },
  { id: "easy",         label: "Easy to show up",   Icon: CheckCircle2  },
  { id: "felt-off",     label: "Felt off",          Icon: Minus         },
  { id: "no-show",      label: "No-show issue",     Icon: UserX         },
  { id: "great-host",   label: "Great host",        Icon: Star          },
  { id: "low-pressure", label: "Low pressure",      Icon: Feather       },
  { id: "new-fave",     label: "New favorite",      Icon: Heart         },
];

const PERSON_FEEDBACK = [
  { id: "add-circle",   label: "Add to Circle",    style: "positive" },
  { id: "would-again",  label: "Would move again", style: "positive" },
  { id: "good-vibes",   label: "Good vibes",       style: "positive" },
  { id: "no-show",      label: "Didn't show",      style: "negative" },
  { id: "felt-off",     label: "Felt off",         style: "negative" },
  { id: "report",       label: "Report",           style: "report"   },
];

type ReportOption = { label: string; Icon: React.ElementType };
const REPORT_OPTIONS: ReportOption[] = [
  { label: "No-show",         Icon: UserX          },
  { label: "Creepy behavior", Icon: AlertCircle    },
  { label: "Harassment",      Icon: ShieldAlert    },
  { label: "Fake Move",       Icon: AlertTriangle  },
  { label: "Spam / scam",     Icon: Trash2         },
  { label: "Other",           Icon: MoreHorizontal },
];

const MOCK_ATTENDEES = [
  { id: "a1", name: "Marcus L.",  initials: "ML", color: "bg-orange-500", personId: "cp1" },
  { id: "a2", name: "Priya S.",   initials: "PS", color: "bg-pink-500",   personId: "cp3" },
  { id: "a3", name: "Jordan K.",  initials: "JK", color: "bg-blue-500",   personId: "cp2" },
  { id: "a4", name: "Alex T.",    initials: "AT", color: "bg-purple-500", personId: "cp6" },
];

export default function PostMove() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { rallies } = useRallies();
  const { addToCircle, markWouldMoveAgain } = useCirclePersons();
  const { toast } = useToast();

  const move = rallies.find(r => r.id === id);
  const cat = move ? (CAT_CONFIG[move.category] ?? defaultCatConfig) : defaultCatConfig;
  const CatIcon = move ? CAT_ICONS[move.category] : null;

  const [step, setStep]       = useState(1);
  const [reactions, setReactions] = useState<Set<string>>(new Set());
  const [attendeeFeedback, setAttendeeFeedback] = useState<Record<string, string[]>>({});
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState<Set<string>>(new Set());

  const toggleReaction = (id: string) => {
    setReactions(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAttendeeFeedback = (attendeeId: string, feedbackId: string) => {
    if (feedbackId === "report") { setReportTarget(attendeeId); return; }
    setAttendeeFeedback(prev => {
      const current = prev[attendeeId] ?? [];
      const updated = current.includes(feedbackId)
        ? current.filter(f => f !== feedbackId)
        : [...current, feedbackId];

      if (feedbackId === "add-circle") {
        const attendee = MOCK_ATTENDEES.find(a => a.id === attendeeId);
        if (attendee && !current.includes("add-circle")) addToCircle(attendee.personId);
      }
      if (feedbackId === "would-again") {
        const attendee = MOCK_ATTENDEES.find(a => a.id === attendeeId);
        if (attendee && !current.includes("would-again")) markWouldMoveAgain(attendee.personId);
      }
      return { ...prev, [attendeeId]: updated };
    });
  };

  const handleReportSubmit = (reason: string) => {
    if (reportTarget) {
      setReportSubmitted(prev => new Set(prev).add(reportTarget));
      setReportTarget(null);
      toast({ title: "Thanks. We'll review this.", description: "Your feedback is private and helps keep Brio safe.", duration: 3000 });
    }
  };

  if (!move) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center p-8">
        <p className="text-white font-bold mb-2">Move not found</p>
        <Link href="/discover"><span className="text-primary text-sm">← Back to Discover</span></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">

      {/* Header */}
      <header className="px-4 pt-12 pb-4 flex items-center gap-3">
        <Link href={`/rally/${id}`}>
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
        </Link>
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-0.5">After the Move</p>
          <h1 className="text-base font-black text-white truncate">{move.title}</h1>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn("h-1.5 rounded-full transition-all", s === step ? "w-6 bg-primary" : s < step ? "w-2 bg-primary/50" : "w-2 bg-white/10")} />
          ))}
        </div>
      </header>

      <div className="flex-1 px-4 overflow-y-auto pb-28">

        {/* ── Step 1: Reactions ──────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black text-white mb-1">How was the move?</h2>
              <p className="text-sm text-gray-500">Help Brio keep the right people moving together.</p>
            </div>

            {/* Move preview */}
            <div className="flex items-center gap-3 bg-[#161616] border border-white/5 rounded-2xl p-3.5 mb-6">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", cat.color)}>
                {CatIcon
                  ? <CatIcon className={cat.text} strokeWidth={1.75} style={{ width: 18, height: 18 }} />
                  : <span className="text-xl">{cat.emoji}</span>
                }
              </div>
              <div>
                <p className="font-bold text-white text-sm">{move.title}</p>
                <p className="text-[11px] text-gray-500">{move.time} · {move.location}</p>
              </div>
            </div>

            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-3">Pick all that apply</h3>
            <div className="grid grid-cols-2 gap-2">
              {REACTIONS.map(r => {
                const selected = reactions.has(r.id);
                const isNegative = r.id === "felt-off" || r.id === "no-show";
                return (
                  <button
                    key={r.id}
                    onClick={() => toggleReaction(r.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border text-left transition-all active:scale-[0.97]",
                      selected
                        ? isNegative
                          ? "bg-red-500/10 border-red-500/30 text-white"
                          : "bg-primary/15 border-primary/35 text-white"
                        : "bg-[#161616] border-white/5 text-gray-400"
                    )}
                  >
                    <r.Icon className={cn("w-4 h-4 shrink-0", selected ? (isNegative ? "text-red-400" : "text-primary") : "text-gray-500")} strokeWidth={1.75} />
                    <span className="text-xs font-bold leading-snug">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Attendee feedback ──────────────────────────────── */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black text-white mb-1">Who showed up?</h2>
              <p className="text-sm text-gray-500">Your feedback is private — only used for trust and safety.</p>
            </div>

            <div className="space-y-3">
              {MOCK_ATTENDEES.map(attendee => {
                const fb = attendeeFeedback[attendee.id] ?? [];
                const reported = reportSubmitted.has(attendee.id);
                return (
                  <div key={attendee.id} className="bg-[#161616] border border-white/5 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0", attendee.color)}>
                        {attendee.initials}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">{attendee.name}</p>
                        {fb.includes("add-circle") && (
                          <p className="text-[11px] text-primary font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Added to your Circle
                          </p>
                        )}
                        {reported && (
                          <p className="text-[11px] text-gray-500">Reported · under review</p>
                        )}
                      </div>
                    </div>

                    {!reported && (
                      <div className="flex flex-wrap gap-1.5">
                        {PERSON_FEEDBACK.map(f => {
                          const selected = fb.includes(f.id);
                          return (
                            <button
                              key={f.id}
                              onClick={() => toggleAttendeeFeedback(attendee.id, f.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all active:scale-95",
                                f.style === "report"
                                  ? "bg-transparent border-white/8 text-gray-600 hover:border-red-500/30 hover:text-red-400"
                                  : selected
                                  ? f.style === "positive"
                                    ? "bg-primary/15 border-primary/30 text-white"
                                    : "bg-red-500/10 border-red-500/25 text-red-400"
                                  : "bg-white/5 border-white/8 text-gray-400"
                              )}
                            >
                              {f.id === "add-circle" && selected ? <span className="flex items-center gap-1"><Check className="w-3 h-3" /> In Circle</span> : f.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 3: Keep it going ─────────────────────────────────── */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-primary" strokeWidth={1.75} />
              </div>
              <h2 className="text-xl font-black text-white mb-1">Move again?</h2>
              <p className="text-sm text-gray-500">Keep the momentum going. Good moves lead to more moves.</p>
            </div>

            <div className="space-y-3">
              <Link href="/create">
                <div className="flex items-center gap-4 bg-primary/10 border border-primary/25 rounded-2xl px-4 py-4 active:scale-[0.98] transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-white text-sm">Make Another Move</p>
                    <p className="text-[11px] text-gray-400">Post your next one right now</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                </div>
              </Link>

              <Link href="/create">
                <div className="flex items-center gap-4 bg-[#161616] border border-white/5 rounded-2xl px-4 py-4 active:scale-[0.98] transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-white text-sm">Invite Them to a Move</p>
                    <p className="text-[11px] text-gray-400">Make a move and share it with the crew</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </div>
              </Link>

              <Link href="/circles">
                <div className="flex items-center gap-4 bg-[#161616] border border-white/5 rounded-2xl px-4 py-4 active:scale-[0.98] transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <UsersRound className="w-5 h-5 text-gray-400" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-white text-sm">Add People to Your Circle</p>
                    <p className="text-[11px] text-gray-400">Build your trusted Brio people</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                </div>
              </Link>

              <button
                onClick={() => navigate("/discover")}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-500 hover:text-gray-300 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto px-4 pb-8 pt-4 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/95 to-transparent z-50">
        {step < 3 ? (
          <Button
            onClick={() => setStep(s => s + 1)}
            className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_20px_rgba(250,204,21,0.3)] flex items-center justify-center gap-2"
          >
            {step === 1 ? "Next — Who Showed Up?" : "Next — Keep It Going"}
            <ChevronRight className="w-5 h-5" />
          </Button>
        ) : (
          <Link href="/discover">
            <Button className="w-full bg-primary hover:bg-primary/90 text-black font-black text-base rounded-xl h-14 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
              Done · Back to Discover
            </Button>
          </Link>
        )}
      </div>

      {/* Report modal */}
      <Dialog open={reportTarget !== null} onOpenChange={() => setReportTarget(null)}>
        <DialogContent className="w-[90%] max-w-[320px] rounded-2xl bg-[#1a1a1a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Tell us what happened</DialogTitle>
            <DialogDescription className="text-gray-400">
              Your report is private. We'll review it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-1">
            {REPORT_OPTIONS.map(({ label, Icon }) => (
              <Button
                key={label}
                variant="outline"
                className="justify-start bg-white/5 border-white/8 hover:bg-white/10 text-left rounded-xl text-gray-200 gap-2.5 h-auto py-3"
                onClick={() => handleReportSubmit(label)}
              >
                <Icon className="w-4 h-4 shrink-0 text-gray-400" strokeWidth={1.75} />
                <span className="text-sm font-medium">{label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
