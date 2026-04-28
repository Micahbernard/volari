"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type {
  ComponentProps,
  FocusEvent as ReactFocusEvent,
  PointerEvent as ReactPointerEvent,
  Ref,
} from "react";

// ─────────────────────────────────────────────────────────────
// MercuryMenuToggle  ✦  liquid-metal menu trigger
//
// A spherical pool of liquid mercury that rises from emptiness
// on hover, tracks the cursor with physical spring damping, and
// collapses back into droplets on leave.
//
// Rest:
//   An empty dark vessel — a hairline ring breathing at the
//   rhythm of a distant gravitational lens. A faint mercury
//   ghost flickers at the convergence beat (CSS .lens-ghost).
//
// Hover:
//   Mercury RISES from the bottom as a liquid column with a
//   meniscus surface — not a flat sphere. The fill uses a
//   7-stop metallic gradient: deep gunmetal shadows at the
//   equator, bright silver at the pole, and a razor-sharp
//   specular pin-spot that tracks the cursor. A thin
//   meniscus ring traces the liquid surface.
//
//   Cursor tracking: the specular slides across the surface
//   like a reflection on liquid metal — body and sheen move
//   at different rates so the sphere reads as 3D volume.
//
//   The hamburger underneath magnifies subtly through the
//   liquid lens (scale + offset driven by cursor distance).
//
// Leave:
//   400 ms grace window. After that the pool recedes —
//   mercury droplets scatter outward and the liquid column
//   drains downward. The vessel returns to its breathing ring.
//
// Open:
//   Ring cycle accelerates to 3.5 s; halo pinned at peak.
//   Hamburger morphs to ✕ above the liquid layer.
//
// Reduced motion:
//   Static mercury silhouette at ~40 % opacity; no rise
//   animation, no particles, cursor tracking disabled.
// ─────────────────────────────────────────────────────────────

// Particle layout — 8 droplets at 22.5° offsets
const PARTICLE_ANGLES_DEG = [
  22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5,
] as const;

const RIM_RADIUS = 21; // viewBox 48×48

type Phase = "rest" | "enter" | "active" | "exit";
type LensState = "rest" | "hover" | "open";

type MercuryMenuToggleProps = Omit<
  ComponentProps<"button">,
  "onClick" | "type" | "children"
> & {
  isOpen?: boolean;
  onToggle?: (next: boolean) => void;
  ref?: Ref<HTMLButtonElement>;
};

export default function MercuryMenuToggle({
  ref,
  isOpen = false,
  onToggle,
  className = "",
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  onFocus,
  onBlur,
  ...rest
}: MercuryMenuToggleProps) {
  const [phase, setPhase] = useState<Phase>("rest");
  const isActive = phase !== "rest";

  const lensState: LensState = isOpen
    ? "open"
    : isActive
    ? "hover"
    : "rest";

  // ─── Pointer tracking with spring physics ──────────────────
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const cx = useSpring(px, { stiffness: 180, damping: 24, mass: 0.5 });
  const cy = useSpring(py, { stiffness: 180, damping: 24, mass: 0.5 });

  // Intensity ramps 0→1 when mercury is present
  const intensity = useSpring(0, { stiffness: 80, damping: 20 });
  useEffect(() => {
    intensity.set(isActive ? 1 : 0);
  }, [isActive, intensity]);

  // ─── Mercury body gradient centres (cursor-tracking) ───────
  // Body moves slower — feels like depth beneath the surface
  const bodyCx = useTransform(cx, (v) => 0.35 + v * 0.30);
  const bodyCy = useTransform(cy, (v) => 0.28 + v * 0.28);
  // Specular cap moves faster — rides the surface
  const sheenCx = useTransform(cx, (v) => 0.28 + v * 0.44);
  const sheenCy = useTransform(cy, (v) => 0.20 + v * 0.36);
  // Rim light (fresnel) shifts opposite to specular
  const rimCx = useTransform(cx, (v) => 0.55 + (1 - v) * 0.20);
  const rimCy = useTransform(cy, (v) => 0.45 + (1 - v) * 0.20);

  // ─── Hamburger lens magnification ──────────────────────────
  const offsetX = useTransform(cx, (v) => (v - 0.5) * 3.5);
  const offsetY = useTransform(cy, (v) => (v - 0.5) * 3.5);
  const distFromCentre = useTransform<number, number>(
    [cx, cy],
    (vals: number[]) => {
      const [x, y] = vals;
      const dx = x - 0.5;
      const dy = y - 0.5;
      return Math.sqrt(dx * dx + dy * dy);
    }
  );
  const iconScale = useTransform<number, number>(
    [distFromCentre, intensity],
    (vals: number[]) => {
      const [d, i] = vals;
      return 1 + i * Math.max(0, 0.05 - d * 0.06);
    }
  );

  // ─── Stable SVG IDs ────────────────────────────────────────
  const baseId = useId().replace(/:/g, "-");
  const bodyId = `merc-body-${baseId}`;
  const sheenId = `merc-sheen-${baseId}`;
  const rimId = `merc-rim-${baseId}`;
  const deepId = `merc-deep-${baseId}`;
  const ghostId = `merc-ghost-${baseId}`;

  // ─── Phase timers ──────────────────────────────────────────
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    [enterTimerRef, exitTimerRef, restTimerRef].forEach((r) => {
      if (r.current) { clearTimeout(r.current); r.current = null; }
    });
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const beginEnter = useCallback(() => {
    clearTimers();
    setPhase("enter");
    enterTimerRef.current = setTimeout(() => {
      setPhase("active");
      enterTimerRef.current = null;
    }, 350);
  }, [clearTimers]);

  const beginExit = useCallback(() => {
    clearTimers();
    exitTimerRef.current = setTimeout(() => {
      setPhase("exit");
      exitTimerRef.current = null;
      restTimerRef.current = setTimeout(() => {
        setPhase("rest");
        restTimerRef.current = null;
      }, 480);
    }, 400);
  }, [clearTimers]);

  const cancelExit = useCallback(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (restTimerRef.current) {
      clearTimeout(restTimerRef.current);
      restTimerRef.current = null;
    }
  }, []);

  // ─── Event handlers ────────────────────────────────────────
  const handlePointerEnter = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      px.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      py.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));

      if (phase === "rest") beginEnter();
      else { cancelExit(); if (phase === "exit") setPhase("active"); }

      onPointerEnter?.(e);
    },
    [phase, px, py, beginEnter, cancelExit, onPointerEnter]
  );

  const handlePointerLeave = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      px.set(0.5);
      py.set(0.5);
      if (phase === "active" || phase === "enter") beginExit();
      onPointerLeave?.(e);
    },
    [phase, px, py, beginExit, onPointerLeave]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (phase === "active") {
        const rect = e.currentTarget.getBoundingClientRect();
        px.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
        py.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));
      }
      onPointerMove?.(e);
    },
    [phase, px, py, onPointerMove]
  );

  const handleFocus = useCallback(
    (e: ReactFocusEvent<HTMLButtonElement>) => {
      if (phase === "rest" || phase === "exit") beginEnter();
      else cancelExit();
      onFocus?.(e);
    },
    [phase, beginEnter, cancelExit, onFocus]
  );

  const handleBlur = useCallback(
    (e: ReactFocusEvent<HTMLButtonElement>) => {
      if (phase === "active" || phase === "enter") beginExit();
      onBlur?.(e);
    },
    [phase, beginExit, onBlur]
  );

  const handleClick = useCallback(() => {
    onToggle?.(!isOpen);
  }, [isOpen, onToggle]);

  // ─── Mercury clip-path for liquid rise effect ──────────────
  // Instead of a flat sphere appearing, mercury rises from the
  // bottom as a liquid column with a curved meniscus surface
  const mercuryClip = useTransform<number, string>(
    [cy, intensity],
    (vals: number[]) => {
      const [, i] = vals;
      // i: 0→1 as mercury materialises
      // Start from bottom (100%) and rise to full circle (0%)
      const topInset = Math.max(0, (1 - i) * 100);
      // Meniscus curve: a slight elliptical curve at the surface
      const meniscusDepth = i > 0.01 ? 6 : 0;
      return `ellipse(88% ${50 + meniscusDepth}% at 50% ${50 + topInset / 2}%)`;
    }
  );

  return (
    <button
      {...rest}
      ref={ref}
      data-state={lensState}
      data-phase={phase}
      type="button"
      aria-label={rest["aria-label"] ?? (isOpen ? "Close menu" : "Open menu")}
      aria-expanded={isOpen}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={[
        "lens-button group/lens relative inline-flex h-12 w-12 shrink-0",
        "items-center justify-center rounded-full",
        "outline-none cursor-pointer select-none touch-manipulation",
        "bg-[#08080a] border border-[rgba(50,50,58,0.25)]",
        "transition-colors duration-500",
        "hover:border-[rgba(80,80,92,0.45)]",
        // Gravitational lens ring animations
        "[animation:lens-border-pulse_9s_ease-in-out_infinite,lens-shadow-pulse_9s_ease-in-out_infinite]",
        "data-[state=hover]:[animation-duration:5s,5s]",
        "data-[state=open]:[animation-duration:3.5s,3.5s]",
        className,
      ].join(" ")}
    >
      {/* ── Outer halo (gravity strengthens) ────────────────── */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-[-1px] rounded-full
          opacity-0 transition-opacity duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-data-[state=hover]/lens:opacity-50
          group-data-[state=open]/lens:opacity-100
          [box-shadow:inset_0_0_12px_rgba(200,200,212,0.35),0_0_16px_2px_rgba(200,200,212,0.30)]
          motion-reduce:hidden
        "
      />

      {/* ── Mercury vessel (single SVG) ─────────────────────── */}
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] overflow-hidden rounded-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* 
            MERCURY BODY — 7-stop metallic gradient
            Real mercury: almost mirror-like at centre,
            deep blue-grey in shadows, cool silver mid-tones.
            The gradient centre tracks cursor via springs.
          */}
          <motion.radialGradient
            id={bodyId}
            cx={bodyCx as MotionValue<number>}
            cy={bodyCy as MotionValue<number>}
            r="0.82"
          >
            {/* Specular pole — blinding bright */}
            <stop offset="0%" stopColor="#f8f8fc" />
            {/* Bright silver — where light grazes */}
            <stop offset="12%" stopColor="#e4e4ec" />
            {/* Mid silver — body of the metal */}
            <stop offset="30%" stopColor="#b8b8c4" />
            {/* Shadow begins — cooler, darker */}
            <stop offset="52%" stopColor="#6a6a78" />
            {/* Deep shadow — blue-grey undertone */}
            <stop offset="74%" stopColor="#2e2e3a" />
            {/* Equatorial edge — near black */}
            <stop offset="100%" stopColor="#111118" />
          </motion.radialGradient>

          {/* 
            SPECULAR CAP — razor-sharp highlight
            Tiny radius (0.22) so it's a pin-spot, not a wash.
            Moves faster than body — reads as surface reflection.
          */}
          <motion.radialGradient
            id={sheenId}
            cx={sheenCx as MotionValue<number>}
            cy={sheenCy as MotionValue<number>}
            r="0.22"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="35%" stopColor="rgba(232,232,240,0.55)" />
            <stop offset="70%" stopColor="rgba(200,200,212,0.08)" />
            <stop offset="100%" stopColor="rgba(200,200,212,0)" />
          </motion.radialGradient>

          {/* 
            RIM LIGHT — fresnel edge glow
            Opposite side to specular — the thin edge of the
            sphere catches light and glows. Shifts opposite
            to the cursor so the sphere reads as 3D volume.
          */}
          <motion.radialGradient
            id={rimId}
            cx={rimCx as MotionValue<number>}
            cy={rimCy as MotionValue<number>}
            r="0.75"
          >
            <stop offset="60%" stopColor="rgba(180,180,196,0)" />
            <stop offset="82%" stopColor="rgba(180,180,196,0.15)" />
            <stop offset="92%" stopColor="rgba(210,210,222,0.35)" />
            <stop offset="100%" stopColor="rgba(230,230,240,0.55)" />
          </motion.radialGradient>

          {/* 
            DEEP SHADOW — beneath the surface
            A second gradient layer that adds depth at the
            bottom-left quadrant, giving the sphere weight.
          */}
          <radialGradient id={deepId} cx="0.35" cy="0.70" r="0.65">
            <stop offset="0%" stopColor="rgba(10,10,18,0.50)" />
            <stop offset="45%" stopColor="rgba(15,15,24,0.25)" />
            <stop offset="100%" stopColor="rgba(15,15,24,0)" />
          </radialGradient>

          {/* Ghost — static, for rest-state flicker */}
          <radialGradient id={ghostId} cx="0.42" cy="0.32" r="0.85">
            <stop offset="0%" stopColor="#c0c0cc" />
            <stop offset="55%" stopColor="#5a5a68" />
            <stop offset="100%" stopColor="#1a1a22" />
          </radialGradient>
        </defs>

        {/* ── Ghost flicker (rest only) ───────────────────── */}
        {phase === "rest" && (
          <g className="lens-ghost">
            <circle cx="24" cy="24" r="22" fill={`url(#${ghostId})`} />
          </g>
        )}

        {/* ── Mercury liquid body ─────────────────────────── */}
        <motion.g
          initial={false}
          animate={{
            scale: phase === "enter" || phase === "active" ? 1 : 0,
            opacity: phase === "enter" || phase === "active" ? 1 : 0,
          }}
          style={{
            transformOrigin: "24px 28px",
            clipPath: mercuryClip,
          }}
          transition={
            phase === "enter"
              ? { duration: 0.50, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
              : phase === "exit"
              ? { duration: 0.38, ease: [0.4, 0, 0.6, 1] }
              : { duration: 0.2 }
          }
        >
          {/* Base metal body */}
          <rect width="48" height="48" fill={`url(#${bodyId})`} />
          {/* Deep shadow for volume */}
          <rect width="48" height="48" fill={`url(#${deepId})`} />
          {/* Fresnel rim light */}
          <rect width="48" height="48" fill={`url(#${rimId})`} />
          {/* Specular highlight (surface reflection) */}
          <rect width="48" height="48" fill={`url(#${sheenId})`} />
        </motion.g>

        {/* 
          MENISCUS LINE — the liquid surface tension ring
          A thin bright line that traces where the mercury
          surface meets the vessel wall. Only visible when
          mercury is present (active/enter phases).
        */}
        <motion.circle
          cx="24"
          cy="24"
          r="21.5"
          fill="none"
          stroke="rgba(200,200,212,0.25)"
          strokeWidth="0.6"
          initial={false}
          animate={{
            opacity: phase === "enter" || phase === "active" ? 1 : 0,
            scale: phase === "enter" || phase === "active" ? 1 : 0.85,
          }}
          style={{ transformOrigin: "24px 24px" }}
          transition={
            phase === "enter"
              ? { duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }
              : phase === "exit"
              ? { duration: 0.30, ease: [0.4, 0, 0.6, 1] }
              : { duration: 0.15 }
          }
        />

        {/* ── Enter droplets (rim → centre) ───────────────── */}
        {phase === "enter" &&
          PARTICLE_ANGLES_DEG.map((angDeg, i) => {
            const ang = (angDeg * Math.PI) / 180;
            const startX = 24 + RIM_RADIUS * Math.cos(ang);
            const startY = 24 + RIM_RADIUS * Math.sin(ang);
            return (
              <motion.circle
                key={`enter-${i}`}
                r={1.4}
                fill="rgba(220,220,228,0.90)"
                initial={{ cx: startX, cy: startY, opacity: 1, scale: 1 }}
                animate={{ cx: 24, cy: 24, opacity: 0, scale: 0.3 }}
                transition={{
                  duration: 0.35,
                  ease: [0.55, 0, 0.55, 1],
                }}
              />
            );
          })}

        {/* ── Exit droplets (centre → outward) ────────────── */}
        {phase === "exit" &&
          PARTICLE_ANGLES_DEG.map((angDeg, i) => {
            const ang = ((angDeg + 8) * Math.PI) / 180;
            const exitX = 24 + 34 * Math.cos(ang);
            const exitY = 24 + 34 * Math.sin(ang);
            const stagger = 0.03 + (i % 3) * 0.055;
            const duration = 0.45 + (i % 3) * 0.08;
            const radius = 1.5 - (i % 3) * 0.25;
            return (
              <motion.circle
                key={`exit-${i}`}
                r={radius}
                fill="rgba(210,210,222,0.75)"
                initial={{ cx: 24, cy: 24, opacity: 1, scale: 1 }}
                animate={{ cx: exitX, cy: exitY, opacity: 0, scale: 0.5 }}
                transition={{
                  duration,
                  delay: stagger,
                  ease: "easeOut",
                }}
              />
            );
          })}
      </svg>

      {/* ── Hamburger ↔ ✕ ─────────────────────────────────── */}
      <svg
        viewBox="0 0 48 48"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <motion.g
          style={{
            x: offsetX,
            y: offsetY,
            scale: iconScale,
            transformOrigin: "24px 24px",
            mixBlendMode: "difference",
          }}
        >
          {/* Top line → rotates to \ */}
          <motion.g
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5 : 0 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <line
              x1="16" y1="19" x2="32" y2="19"
              stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round"
            />
          </motion.g>

          {/* Middle line → fades out */}
          <motion.g
            initial={false}
            animate={{ scaleX: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <line
              x1="16" y1="24" x2="32" y2="24"
              stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round"
            />
          </motion.g>

          {/* Bottom line → rotates to / */}
          <motion.g
            initial={false}
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5 : 0 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <line
              x1="16" y1="29" x2="32" y2="29"
              stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
      </svg>
    </button>
  );
}
