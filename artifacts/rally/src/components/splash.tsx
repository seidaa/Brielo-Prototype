import { useEffect, useState } from "react";

const SPLASH_KEY = "brio_splash_shown";

function Splash({ fading }: { fading: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0d0d] transition-opacity duration-500 ${
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
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  // Show once per browser session on the initial app mount, regardless of route.
  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = !!sessionStorage.getItem(SPLASH_KEY);
    } catch {
      alreadyShown = false;
    }
    if (alreadyShown) return;

    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // Ignore storage failures; the splash still shows for this page load.
    }
    setFading(false);
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const hideTimer = setTimeout(() => setShow(false), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [show]);

  if (!show) return null;
  return <Splash fading={fading} />;
}
