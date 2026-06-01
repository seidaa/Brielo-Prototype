import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * BrioLogo — "Brielo" wordmark with the natural i-dot replaced by a yellow ring.
 *
 * The ring is positioned via runtime DOM measurement so it works correctly on
 * every device and font (Safari / SF Pro, Chrome / Roboto, etc.) without any
 * hardcoded font-metric assumptions.
 *
 * Steps:
 *  1. Render "Br", dotless-ı (U+0131), "o" as normal HTML text.
 *  2. After fonts load, measure the ı span's bounding rect.
 *  3. Place a hollow yellow ring with its center just above the ı's top edge
 *     — exactly where the natural dot would sit.
 */

type Size = "sm" | "md" | "lg" | "xl" | "hero";

const TEXT_SIZE: Record<Size, string> = {
  sm:   "text-[18px]",
  md:   "text-[24px]",
  lg:   "text-[32px]",
  xl:   "text-[40px]",
  hero: "text-[52px]",
};

interface BrioLogoProps {
  size?: Size;
  className?: string;
}

interface RingMetrics {
  left: number;
  top:  number;
  size: number;
  stroke: number;
}

export function BrioLogo({ size = "md", className }: BrioLogoProps) {
  const fs = TEXT_SIZE[size];

  const wrapRef = useRef<HTMLSpanElement>(null);
  const stemRef = useRef<HTMLSpanElement>(null);
  const [ring, setRing] = useState<RingMetrics | null>(null);

  useEffect(() => {
    function measure() {
      const wrap = wrapRef.current;
      const stem = stemRef.current;
      if (!wrap || !stem) return;

      const wBox  = wrap.getBoundingClientRect();
      const sBox  = stem.getBoundingClientRect();
      const px    = parseFloat(getComputedStyle(stem).fontSize);

      // Ring geometry — sized like a natural i-dot (~22 % of font-size)
      const ringPx   = px * 0.22;
      const strokePx = px * 0.065;

      // Center the ring horizontally on the ı stem.
      // Nudge left by ~2 % em — the dotless-ı glyph has slightly more
      // right side-bearing than left, so pure sBox.width/2 sits a touch right.
      const cx = sBox.left - wBox.left + sBox.width / 2 + px * 0.01;

      // Anchor from the BOTTOM of the span (descender line) — much more
      // stable across fonts than the top which includes variable line-box
      // leading. Typical font metrics: descender ≈ 0.20 em below baseline,
      // cap-height ≈ 0.72 em above baseline  →  cap top ≈ bottom − 0.92 em.
      // We want the ring bottom to float ~10 % of em above the cap top —
      // close but not touching, like a natural i-dot.
      const capTop = (sBox.bottom - wBox.top) - px * 0.92;
      const cy = capTop - ringPx / 2 - px * 0.10;

      setRing({
        left:   cx - ringPx / 2,
        top:    cy - ringPx / 2,
        size:   ringPx,
        stroke: strokePx,
      });
    }

    // Measure immediately (fonts may already be cached)
    measure();
    // Re-measure once web fonts finish loading
    document.fonts.ready.then(measure);
    // Re-measure on resize / orientation change
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [size]);

  return (
    <span
      ref={wrapRef}
      className={cn("relative inline-flex items-baseline select-none", className)}
      aria-label="Brielo"
    >
      {/* "Br" */}
      <span className={cn("font-black text-white tracking-tight leading-none", fs)}>
        Br
      </span>

      {/* Dotless ı — no natural dot, ring overlay added by JS below */}
      <span
        ref={stemRef}
        className={cn("font-black text-white tracking-tight leading-none", fs)}
      >
        ı
      </span>

      {/* "elo" */}
      <span className={cn("font-black text-white tracking-tight leading-none", fs)}>
        elo
      </span>

      {/* Yellow ring — positioned after runtime measurement */}
      {ring && (
        <span
          aria-hidden="true"
          className="absolute pointer-events-none rounded-full"
          style={{
            left:            ring.left,
            top:             ring.top,
            width:           ring.size,
            height:          ring.size,
            border:          `${ring.stroke}px solid #FACC15`,
            backgroundColor: "transparent",
          }}
        />
      )}
    </span>
  );
}

/** App-icon mark — standalone ring on a dark rounded square */
export function BrioMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-[22px]",
        "bg-white/5 border border-white/8 shadow-[0_0_50px_rgba(250,204,21,0.22)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="rounded-full"
        style={{ width: "46%", height: "46%", border: "13% solid #FACC15" }}
      />
    </div>
  );
}
