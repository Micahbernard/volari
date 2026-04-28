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
// MercuryMenuToggle  ✦  Alchemical Decanter
//
// A vessel of quicksilver that fills on approach.
//
// IDLE: The crucible breathes — a faint ring pulses outward
//   and back, drawing the eye. Inside, a ghost of mercury
//   flickers at the convergence beat.
//
// HOVER: Liquid metal RISES from the bottom as a heavy column.
//   The surface tilts toward the cursor — physics-driven
//   slosh that feels like real mercury in a glass vessel.
//   A specular highlight rides the meniscus. The dot at
//   centre rotates to indicate readiness.
//
// OPEN: Mercury holds at peak. The dot unfurls into an X.
//   Halo locks at full brightness.
//
// THEME: All colours route through CSS variables — the same
//   steel gradient as the hero VOLARI text. Daybreak swaps
//   to warm brass automatically.
// ─────────────────────────────────────────────────────────────

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

  // ─── Cursor tracking for liquid slosh ──────────────────────
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const cx = useSpring(px, { stiffness: 120, damping: 18, mass: 0.6 });
  const cy = useSpring(py, { stiffness: 120, damping: 18, mass: 0.6 });

  // Intensity: 0 at rest → 1 when mercury is present
  const intensity = useSpring(0, { stiffness: 60, damping: 16 });
  useEffect(() => {
    intensity.set(isActive ? 1 : 0);
  }, [isActive, intensity]);

  // ─── Liquid surface tilt (cursor-driven slosh) ─────────────
  // When cursor is at left edge (0), surface tilts left (-8deg)
  // When cursor is at right edge (1), surface tilts right (+8deg)
  const surfaceTilt = useTransform(cx, [0, 0.5, 1], [-10, 0, 10]);
  const surfaceDip = useTransform(cy, [0, 0.5, 1], [-4, 0, 4]);

  // Specular highlight slides opposite to tilt (reflection physics)
  const specularX = useTransform(cx, (v) => 35 + (1 - v) * 20);
  const specularY = useTransform(cy, (v) => 25 + (1 - v) * 15);

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
    }, 500);
  }, [clearTimers]);

  const beginExit = useCallback(() => {
    clearTimers();
    exitTimerRef.current = setTimeout(() => {
      setPhase("exit");
      exitTimerRef.current = null;
      restTimerRef.current = setTimeout(() => {
        setPhase("rest");
        restTimerRef.current = null;
      }, 500);
    }, 300);
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
      if (phase === "active" || phase === "enter") {
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

  // ─── Stable SVG IDs ────────────────────────────────────────
  const uid = useRef(`merc-${Math.random().toString(36).slice(2, 9)}`).current;
  const bodyId = `merc-body-${uid}`;
  const sheenId = `merc-sheen-${uid}`;
  const deepId = `merc-deep-${uid}`;

  // ─── Liquid fill clip-path ─────────────────────────────────
  // Rises from bottom (100% inset) to full (0% inset)
  const fillClip = useTransform(
    intensity,
    (i: number) => `inset(${Math.max(0, (1 - i) * 100)}% 0 0 0)`
  );

  // ─── Surface path with tilt ────────────────────────────────
  // A curved meniscus line that tilts based on cursor position
  const surfacePath = useTransform<number, string>(
    [surfaceTilt, surfaceDip],
    (vals: number[]) => {
      const [tilt, dip] = vals;
      // Convert tilt angle to endpoint offsets
      const leftY = 4 + dip + tilt * 0.3;
      const rightY = 4 - dip - tilt * 0.3;
      const midY = -2 + dip;
      return `M 2 ${leftY} Q 24 ${midY} 46 ${rightY}`;
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
        "bg-[var(--v-void)] border border-[rgba(55,55,62,0.25)]",
        "transition-colors duration-500",
        "hover:border-[rgba(100,100,110,0.45)]",
        className,
      ].join(" ")}
    >
      {/* ── Idle breathing pulse — draws the eye ────────────── */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-[-4px] rounded-full
          [animation:mercury-breathe_3s_ease-in-out_infinite]
          motion-reduce:[animation:none]
        "
        style={{
          boxShadow: "0 0 12px 3px rgba(140,140,155,0.15), 0 0 28px 8px rgba(140,140,155,0.08)",
        }}
      />

      {/* ── Outer halo (hover / open only) ──────────────────── */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-2px] rounded-full"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.85,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          boxShadow: "inset 0 0 16px rgba(200,200,212,0.35), 0 0 22px 4px rgba(200,200,212,0.25)",
        }}
      />

      {/* ── Gold accent bloom (hover only) ──────────────────── */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-3px] rounded-full"
        initial={false}
        animate={{ opacity: isActive ? 0.6 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          boxShadow: "0 0 24px 6px var(--accent-glow-soft), 0 0 48px 12px var(--accent-glow-soft)",
        }}
      />

      {/* ── Mercury vessel (single SVG) ─────────────────────── */}
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] overflow-hidden rounded-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* 9-stop steel gradient (auto-swaps to brass on daybreak) */}
          <linearGradient id={bodyId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--hero-metal-0)" />
            <stop offset="11%" stopColor="var(--hero-metal-1)" />
            <stop offset="25%" stopColor="var(--hero-metal-2)" />
            <stop offset="38%" stopColor="var(--hero-metal-3)" />
            <stop offset="48%" stopColor="var(--hero-metal-4)" />
            <stop offset="55%" stopColor="var(--hero-metal-5)" />
            <stop offset="62%" stopColor="var(--hero-metal-6)" />
            <stop offset="78%" stopColor="var(--hero-metal-7)" />
            <stop offset="100%" stopColor="var(--hero-metal-8)" />
          </linearGradient>

          {/* Specular highlight — razor sharp, cursor-driven */}
          <motion.radialGradient
            id={sheenId}
            cx={specularX as MotionValue<number>}
            cy={specularY as MotionValue<number>}
            r="0.22"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
            <stop offset="30%" stopColor="rgba(240,240,248,0.45)" />
            <stop offset="65%" stopColor="rgba(220,220,232,0.08)" />
            <stop offset="100%" stopColor="rgba(220,220,232,0)" />
          </motion.radialGradient>

          {/* Deep shadow beneath the surface */}
          <radialGradient id={deepId} cx="35%" cy="80%" r="65%">
            <stop offset="0%" stopColor="rgba(5,5,8,0.60)" />
            <stop offset="40%" stopColor="rgba(8,8,14,0.30)" />
            <stop offset="100%" stopColor="rgba(10,10,18,0)" />
          </radialGradient>

          {/* Mask for ghost flicker — fades in/out via CSS */}
          <radialGradient id={`${uid}-ghost`} cx="42%" cy="38%" r="82%">
            <stop offset="0%" stopColor="var(--hero-metal-4)" stopOpacity="0.30" />
            <stop offset="50%" stopColor="var(--hero-metal-2)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--hero-metal-0)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Ghost at rest (faint mercury silhouette) ──────── */}
        {phase === "rest" && (
          <g className="lens-ghost">
            <circle cx="24" cy="24" r="20" fill={`url(#${uid}-ghost)`} />
          </g>
        )}

        {/* ── Liquid mercury body ───────────────────────────── */}
        <motion.g
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          {/* The mercury fill — clipped to rise from bottom */}
          <motion.g
            style={{ clipPath: fillClip }}
            initial={false}
            animate={{
              y: isActive ? 0 : 6,
            }}
            transition={
              phase === "enter"
                ? { duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }
                : phase === "exit"
                ? { duration: 0.45, ease: [0.4, 0, 0.6, 1] }
                : { duration: 0.2 }
            }
          >
            <rect x="0" y="0" width="48" height="48" fill={`url(#${bodyId})`} />
            <rect x="0" y="0" width="48" height="48" fill={`url(#${deepId})`} />
            <rect x="0" y="0" width="48" height="48" fill={`url(#${sheenId})`} />

            {/* Meniscus surface line — tilts with cursor */}
            <motion.path
              d="M 2 4 Q 24 -2 46 4"
              fill="none"
              stroke="var(--hero-metal-5)"
              strokeWidth="0.8"
              strokeOpacity={0.4}
              initial={false}
              animate={{
                d: surfacePath.get(),
              }}
              transition={{ duration: 0.08 }}
              style={{
                rotate: surfaceTilt,
                transformOrigin: "24px 4px",
              }}
            />
          </motion.g>
        </motion.g>

        {/* ── Inner rim — vessel wall ───────────────────────── */}
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="var(--v-smoke)"
          strokeWidth="0.5"
          strokeOpacity={0.25}
        />
      </svg>

      {/* ── Menu icon: Dot → X ──────────────────────────────── */}
      <svg
        viewBox="0 0 48 48"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <motion.g
          style={{ transformOrigin: "24px 24px" }}
          initial={false}
          animate={{
            rotate: isOpen ? 45 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Centre dot — expands to form the X on open */}
          <motion.circle
            cx="24"
            cy="24"
            r={isOpen ? 12 : 3.5}
            fill="none"
            stroke="var(--v-chalk)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={false}
            animate={{
              r: isOpen ? 12 : 3.5,
              strokeOpacity: isOpen ? 1 : 0.85,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* The cross lines — fade in only when open */}
          <motion.line
            x1="18"
            y1="18"
            x2="30"
            y2="30"
            stroke="var(--v-chalk)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              pathLength: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.line
            x1="30"
            y1="18"
            x2="18"
            y2="30"
            stroke="var(--v-chalk)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              pathLength: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.g>
      </svg>
    </button>
  );
}
