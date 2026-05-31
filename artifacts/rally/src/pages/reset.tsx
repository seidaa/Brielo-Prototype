import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Reset() {
  const [, navigate] = useLocation();

  useEffect(() => {
    Object.keys(localStorage)
      .filter(k => k.startsWith("brio_"))
      .forEach(k => localStorage.removeItem(k));
    navigate("/", { replace: true });
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-600 text-sm font-bold animate-pulse">Resetting…</p>
    </div>
  );
}
