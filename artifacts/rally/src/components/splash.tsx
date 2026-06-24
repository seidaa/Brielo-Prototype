import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const SPLASH_KEY = "brio_splash_shown";

function Splash({ fading }: { fading: boolean }) {
  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0d] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/25 blur-2xl animate-pulse" />
        <div className="absolute inset-0 rounded-full border-2 border-primary/40" />
        <div className="absolute inset-3 rounded-full border border-primary/20" />
        <div className="relative w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.45)]">
          <span className="text-3xl font-black text-black">B</span>
        </div>
      </div>
      <span className="text-2xl font-black tracking-tight text-white">
        Br<span className="text-primary">ie</span>lo
      </span>
      <span className="text-sm font-bold text-primary mt-1">Live More</span>
    </div>
  );
}

export default function SplashGate() {
  const [location] = useLocation();
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);
  const shownRef = useRef(false);

  // Trigger once per session, only when entering a prototype route (not the landing page "/").
  useEffect(() => {
    // Never cover the landing page — hide immediately if we land here mid-splash.
    if (location === "/" || location === "") {
      setShow(false);
      setFading(false);
      return;
    }
    if (shownRef.current) return;

    let alreadyShown = false;
    try {
      alreadyShown = !!sessionStorage.getItem(SPLASH_KEY);
    } catch {
      alreadyShown = false; // restricted storage: fall back to in-memory once-guard
    }
    if (alreadyShown) {
      shownRef.current = true;
      return;
    }

    shownRef.current = true;
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // ignore storage failures; the in-memory guard still limits it to once per load
    }
    setFading(false);
    setShow(true);
  }, [location]);

  // Handle fade/hide timing independently so route changes never reset the timers.
  useEffect(() => {
    if (!show) return;
    const fadeTimer = setTimeout(() => setFading(true), 1500);
    const hideTimer = setTimeout(() => setShow(false), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [show]);

  if (!show) return null;
  return <Splash fading={fading} />;
}
