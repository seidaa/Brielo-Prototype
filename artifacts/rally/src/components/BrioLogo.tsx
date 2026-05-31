import { cn } from "@/lib/utils";

/**
 * BrioLogo renders "Brio" with the natural i-dot replaced by a yellow ring.
 *
 * Technique:
 *  1. Use the Unicode dotless-i (ı / U+0131) for the "i" stem — this removes
 *     the natural white dot from the font itself, so nothing bleeds through.
 *  2. Overlay a hollow yellow ring at the exact natural dot height using
 *     em-relative `bottom` positioning anchored to the span's baseline.
 *
 * Because the natural dot is gone, the ring centre can be fully transparent —
 * no dark-background masking required. Works on any surface colour.
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

export function BrioLogo({ size = "md", className }: BrioLogoProps) {
  const fs = TEXT_SIZE[size];

  return (
    <span
      className={cn("inline-flex items-baseline select-none", className)}
      aria-label="Brio"
    >
      {/* "Br" */}
      <span className={cn("font-black text-white tracking-tight leading-none", fs)}>
        Br
      </span>

      {/*
        "i" — rendered as dotless ı (U+0131) so the font produces NO white dot.
        A hollow yellow ring is then placed at the natural dot height.

        Sizing & position (em-relative, so they scale with every font size):
          • Ring outer: 0.44 em diameter
          • Ring stroke: 0.10 em  →  inner transparent hole: 0.24 em
          • Ring sits just above the top of the stem (cap-height ≈ 0.73 em).
            – inline-block's bottom edge ≈ baseline + 0.24 em (descender)
            – to clear cap-height: ring_bottom_from_element = 0.73 + 0.24 + 0.05 gap = 1.02 em
            – ring centre = 1.02 + 0.22 = 1.24 em from element bottom = 1.00 em above baseline
      */}
      <span className="relative inline-block leading-none">
        <span className={cn("font-black text-white tracking-tight leading-none", fs)}>
          ı
        </span>

        <span
          aria-hidden="true"
          className="absolute left-1/2 rounded-full pointer-events-none"
          style={{
            width:           "0.44em",
            height:          "0.44em",
            border:          "0.10em solid #FACC15",
            backgroundColor: "transparent",
            bottom:          "1.02em",
            transform:       "translateX(-50%)",
          }}
        />
      </span>

      {/* "o" */}
      <span className={cn("font-black text-white tracking-tight leading-none", fs)}>
        o
      </span>
    </span>
  );
}

/** App-icon mark — the ring on its own, at any square size */
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
