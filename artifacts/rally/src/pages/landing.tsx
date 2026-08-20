import { useState } from "react";
import { Link } from "wouter";
import {
  Zap, Users, UserPlus, ShieldCheck, ArrowRight, Check,
  CalendarCheck, MessageCircleQuestion, Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const WAITLIST_KEY = "brio_waitlist";

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  city: string;
  useCase: string;
  createdAt: number;
}

function readWaitlist(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(WAITLIST_KEY);
    return raw ? (JSON.parse(raw) as WaitlistEntry[]) : [];
  } catch {
    return [];
  }
}

const STEPS = [
  { Icon: Zap, title: "Make a Move", body: "Post something you're down to do — a run, a coffee, a jam session — and see who's in." },
  { Icon: UserPlus, title: "Join a Move", body: "Find casual activities happening nearby and save your spot with one tap." },
  { Icon: Users, title: "Build your Circle", body: "After the Move, add the people you'd meet up with again to your Circle." },
];

const TRUST = [
  { Icon: ShieldCheck, title: "Show-Up Trust", body: "A simple, fair signal of who actually shows up. One miss never defines anyone." },
  { Icon: CalendarCheck, title: "Host approval & Request to Join", body: "Hosts can keep a Move open to all, or review each Request to Join before it's confirmed." },
  { Icon: Flag, title: "Safety & reporting", body: "If something feels off, you can flag it privately. Reports are review-only, never public." },
];

export default function Landing() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [useCase, setUseCase] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email to join the waitlist.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    const entry: WaitlistEntry = {
      id: "wl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      email: trimmedEmail,
      city: city.trim(),
      useCase: useCase.trim(),
      createdAt: Date.now(),
    };
    localStorage.setItem(WAITLIST_KEY, JSON.stringify([...readWaitlist(), entry]));
    setError("");
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 h-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-y-auto">
      {/* ── Top nav ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#0d0d0d]/90 backdrop-blur border-b border-white/5">
        <span className="text-xl font-black tracking-tight">
          Br<span className="text-primary">ie</span>lo
        </span>
        <div className="flex items-center gap-2">
          <Link href="/discover">
            <button className="text-[12px] font-bold text-gray-300 hover:text-white px-3 py-2 transition-colors">
              View Prototype
            </button>
          </Link>
          <button
            onClick={scrollToWaitlist}
            className="text-[12px] font-black text-black bg-primary hover:bg-primary/90 rounded-full px-3.5 py-2 transition-colors"
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="relative px-6 pt-12 pb-14 text-center overflow-hidden">
        {/* glow ring */}
        <div className="relative mx-auto mb-8 w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-2xl animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/40" />
          <div className="absolute inset-3 rounded-full border border-primary/20" />
          <div className="relative w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.45)]">
            <span className="text-3xl font-black text-black">B</span>
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight mb-1">Brielo</h1>
        <p className="text-2xl font-black text-primary mb-4">Live More</p>
        <p className="text-base font-bold text-white mb-1.5">Less scrolling. More doing.</p>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto mb-8">
          Make real-life Moves with people who actually show up.
        </p>

        <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
          <Button
            onClick={scrollToWaitlist}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-black font-black text-base shadow-[0_0_20px_rgba(250,204,21,0.3)]"
          >
            Join the Waitlist
          </Button>
          <Link href="/discover">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 font-bold text-base"
            >
              View Prototype <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ── What is Brielo? ──────────────────────────────────────── */}
      <section className="px-6 py-8 border-t border-white/5">
        <h2 className="text-lg font-black mb-3">What is Brielo?</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Brielo helps people turn free time into real life — making it easier to find casual
          activities, join Moves, and build a trusted Circle of people they would meet up with
          again.
        </p>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="px-6 py-8 border-t border-white/5">
        <h2 className="text-lg font-black mb-5">How it works</h2>
        <div className="flex flex-col gap-4">
          {STEPS.map(({ Icon, title, body }, i) => (
            <div key={title} className="flex gap-4 items-start">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-gray-600">0{i + 1}</span>
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                </div>
                <p className="text-[13px] text-gray-400 leading-relaxed mt-0.5">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust matters ────────────────────────────────────────── */}
      <section className="px-6 py-8 border-t border-white/5">
        <h2 className="text-lg font-black mb-2">Trust matters</h2>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
          Brielo is built around showing up for each other — in a way that stays firm but fair.
        </p>
        <div className="flex flex-col gap-3">
          {TRUST.map(({ Icon, title, body }) => (
            <div key={title} className="bg-[#161616] border border-white/5 rounded-2xl p-4 flex gap-3.5">
              <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">{title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Waitlist ─────────────────────────────────────────────── */}
      <section id="waitlist" className="px-6 py-10 border-t border-white/5">
        {submitted ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Check className="w-7 h-7 text-primary" strokeWidth={2.25} />
            </div>
            <h2 className="text-lg font-black mb-1">You're on the Brielo waitlist.</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
              Thanks for your interest. We'll be in touch as Brielo opens up.
            </p>
            <Link href="/discover">
              <Button
                variant="outline"
                className="mt-6 h-11 rounded-xl bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 font-bold px-6"
              >
                View Prototype <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-black mb-1">Join the Waitlist</h2>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-5">
              Be first to make Moves when Brielo launches in your city.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                className={inputClass}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={inputClass}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
              />
              <input
                className={inputClass}
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <textarea
                className={`${inputClass} h-24 py-3 resize-none`}
                placeholder="What would you use Brielo for? (optional)"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
              />
              {error && <p className="text-[13px] text-red-400 font-medium -mt-1">{error}</p>}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-black font-black text-base shadow-[0_0_20px_rgba(250,204,21,0.3)]"
              >
                Join the Waitlist
              </Button>
              <p className="text-[11px] text-gray-600 text-center leading-relaxed">
                Prototype only — your details are stored on this device and no emails are sent.
              </p>
            </form>
          </>
        )}
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="px-6 py-8 border-t border-white/5 text-center">
        <span className="text-base font-black tracking-tight">
          Br<span className="text-primary">ie</span>lo
        </span>
        <p className="text-[11px] text-gray-600 mt-1">Live More.</p>
      </footer>
    </div>
  );
}
