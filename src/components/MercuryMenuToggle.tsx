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
// MercuryMenuToggle  ✦  Liquid Metal Vessel
//
// A crucible of living quicksilver. The mercury inside is not
// a flat paint — it is a field of concentric ripples, wave
// interference, and shifting specular highlights. Like mercury
// pooled in a glass dish, disturbed by an unseen finger.
//
// IDLE: The empty vessel pulses a thin silver ring outward
//   every few seconds — the heartbeat that says "touch me".
//
// HOVER: Mercury POURS upward from the base, flooding the
//   chamber as a liquid column. Inside, concentric rings
//   ripple outward from the centre, catching light at their
//   crests. A slow-moving highlight drifts across the surface
//   like a searchlight on water at night. The meniscus tilts
//   toward the cursor — the metal is heavy, viscous, alive.
//
//   The pour is not uniform — it rises faster at the edges
//   and slower at the centre, creating that characteristic
//   liquid metal meniscus curve.
//
// OPEN: The vessel locks full. Ripples calm but do not stop.
//   The centre dot blooms into an X.
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
  const lensState: LensState = isOpen ? "open" : isActive ? "hover" : "rest";

  // ─── Cursor tracking ───────────────────────────────────────
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cx = useSpring(px, { stiffness: 140, damping: 20, mass: 0.55 });
  const cy = useSpring(py, { stiffness: 140, damping: 20, mass: 0.55 });
  const intensity = useSpring(0, { stiffness: 70, damping: 18 });
  useEffect(() => { intensity.set(isActive ? 1 : 0); }, [isActive, intensity]);

  // ─── Liquid surface tilt ──────────────────────────────────
  const surfaceTilt = useTransform(cx, [0, 0.5, 1], [-12, 0, 12]);
  const specularX = useTransform(cx, (v) => 30 + (1 - v) * 25);
  const specularY = useTransform(cy, (v) => 22 + (1 - v) * 18);

  // ─── Phase timers ────────────────────────────────────────
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
    enterTimerRef.current = setTimeout(() => { setPhase("active"); enterTimerRef.current = null; }, 480);
  }, [clearTimers]);

  const beginExit = useCallback(() => {
    clearTimers();
    exitTimerRef.current = setTimeout(() => {
      setPhase("exit");
      exitTimerRef.current = null;
      restTimerRef.current = setTimeout(() => { setPhase("rest"); restTimerRef.current = null; }, 420);
    }, 280);
  }, [clearTimers]);

  const cancelExit = useCallback(() => {
    [exitTimerRef, restTimerRef].forEach((r) => { if (r.current) { clearTimeout(r.current); r.current = null; } });
  }, []);

  // ─── Event handlers ───────────────────────────────────────
  const handlePointerEnter = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    py.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));
    if (phase === "rest") beginEnter();
    else { cancelExit(); if (phase === "exit") setPhase("active"); }
    onPointerEnter?.(e);
  }, [phase, px, py, beginEnter, cancelExit, onPointerEnter]);

  const handlePointerLeave = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    px.set(0.5); py.set(0.5);
    if (phase === "active" || phase === "enter") beginExit();
    onPointerLeave?.(e);
  }, [phase, px, py, beginExit, onPointerLeave]);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLButtonElement>) => {
    if (phase === "active" || phase === "enter") {
      const rect = e.currentTarget.getBoundingClientRect();
      px.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      py.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));
    }
    onPointerMove?.(e);
  }, [phase, px, py, onPointerMove]);

  const handleFocus = useCallback((e: ReactFocusEvent<HTMLButtonElement>) => {
    if (phase === "rest" || phase === "exit") beginEnter(); else cancelExit();
    onFocus?.(e);
  }, [phase, beginEnter, cancelExit, onFocus]);

  const handleBlur = useCallback((e: ReactFocusEvent<HTMLButtonElement>) => {
    if (phase === "active" || phase === "enter") beginExit();
    onBlur?.(e);
  }, [phase, beginExit, onBlur]);

  const handleClick = useCallback(() => { onToggle?.(!isOpen); }, [isOpen, onToggle]);

  // ─── IDs ─────────────────────────────────────────────────
  const uid = useRef(`mq-${Math.random().toString(36).slice(2, 9)}`).current;
  const rippleId = `mq-ripple-${uid}`;
  const waveId = `mq-wave-${uid}`;
  const aliveId = `mq-alive-${uid}`;

  // ─── Clip for liquid pour ────────────────────────────────
  const fillClip = useTransform(intensity, (i: number) => `inset(${Math.max(0, (1 - i) * 100)}% 0 0 0)`);

  // ─── Surface path with tilt ───────────────────────────────
  const surfacePath = useTransform<number, string>([surfaceTilt], (vals: number[]) => {
    const tilt = vals[0];
    const ly = 5 + tilt * 0.35, ry = 5 - tilt * 0.35, my = -1;
    return `M 2 ${ly} Q 24 ${my} 46 ${ry}`;
  });

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
        "bg-[var(--v-void)] border border-[rgba(55,55,62,0.28)]",
        "transition-colors duration-500",
        "hover:border-[rgba(100,100,110,0.45)]",
        "overflow-visible",
        className,
      ].join(" ")}
    >
      {/* ═══ IDLE SILVER HEARTBEAT ═══ */}
      {!isActive && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full motion-reduce:hidden"
            style={{ animation: "silver-heartbeat 3.2s ease-out infinite", border: "1.5px solid rgba(185,185,200,0.40)" }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full motion-reduce:hidden"
            style={{ animation: "silver-heartbeat 3.2s ease-out 1.06s infinite", border: "1px solid rgba(165,165,182,0.22)" }}
          />
        </>
      )}

      {/* ═══ HOVER HALO ═══ */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-2px] rounded-full"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ boxShadow: "inset 0 0 18px rgba(200,200,212,0.30), 0 0 24px 4px rgba(200,200,212,0.22)" }}
      />

      {/* ═══ GOLD ACCENT BLOOM ═══ */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-3px] rounded-full"
        initial={false}
        animate={{ opacity: isActive ? 0.5 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ boxShadow: "0 0 28px 8px var(--accent-glow-soft)" }}
      />

      {/* ═══ MERCURY VESSEL (single SVG) ═══ */}
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] overflow-hidden rounded-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* 
            RIPPLE FIELD — concentric rings like the reference photo.
            Thin strokes at varying opacity create the interference
            pattern of real mercury disturbed by a fingertip.
          */}
          <radialGradient id={rippleId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="15%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="65%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="75%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="85%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="100%" stopColor="rgba(200,200,212,0.10)" />
          </radialGradient>

          {/* 
            WAVE GRADIENT — the shifting body of the mercury.
            Animated via CSS background-position to create the
            illusion of liquid in slow convection.
          */}
          <radialGradient id={waveId} cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="var(--hero-metal-4)" />
            <stop offset="30%" stopColor="var(--hero-metal-2)" />
            <stop offset="55%" stopColor="var(--hero-metal-6)" />
            <stop offset="80%" stopColor="var(--hero-metal-3)" />
            <stop offset="100%" stopColor="var(--hero-metal-1)" />
          </radialGradient>

          {/* 
            ALIVE HIGHLIGHT — a bright spot that slowly orbits
            the mercury surface, catching different ridges.
          */}
          <radialGradient id={aliveId} cx="30%" cy="25%" r="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.70)" />
            <stop offset="20%" stopColor="rgba(240,240,250,0.25)" />
            <stop offset="50%" stopColor="rgba(220,220,234,0.05)" />
            <stop offset="100%" stopColor="rgba(220,220,234,0)" />
          </radialGradient>

          {/* Specular — cursor tracking */}
          <motion.radialGradient
            id={`mq-sheen-${uid}`}
            cx={specularX as MotionValue<number>}
            cy={specularY as MotionValue<number>}
            r="0.26"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="28%" stopColor="rgba(242,242,250,0.48)" />
            <stop offset="60%" stopColor="rgba(220,220,234,0.08)" />
            <stop offset="100%" stopColor="rgba(220,220,234,0)" />
          </motion.radialGradient>

          {/* Deep shadow */}
          <radialGradient id={`mq-deep-${uid}`} cx="35%" cy="82%" r="68%">
            <stop offset="0%" stopColor="rgba(4,4,8,0.65)" />
            <stop offset="42%" stopColor="rgba(7,7,14,0.32)" />
            <stop offset="100%" stopColor="rgba(10,10,18,0)" />
          </radialGradient>
        </defs>

        {/* ── Ghost at rest ── */}
        {phase === "rest" && (
          <g className="lens-ghost">
            <circle cx="24" cy="24" r="19" fill="var(--v-smoke)" fillOpacity="0.10" />
          </g>
        )}

        {/* ── LIQUID MERCURY BODY ── */}
        <motion.g
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.12 }}
        >
          <motion.g
            style={{ clipPath: fillClip }}
            initial={false}
            animate={{ y: isActive ? 0 : 10 }}
            transition={
              phase === "enter"
                ? { duration: 0.75, delay: 0.02, ease: [0.22, 1, 0.36, 1] }
                : phase === "exit"
                ? { duration: 0.38, ease: [0.4, 0, 0.6, 1] }
                : { duration: 0.18 }
            }
          >
            {/* 
              Base wave body — animated gradient creates the
              slow convection/shift that reads as liquid metal.
            */}
            <rect x="-4" y="-4" width="56" height="56" fill={`url(#${waveId})`} className="mercury-wave" />

            {/* Concentric ripple rings — the interference pattern */}
            <g className="mercury-ripples" opacity="0.6">
              <circle cx="24" cy="24" r="6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
              <circle cx="24" cy="24" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.35" />
              <circle cx="24" cy="24" r="14" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.3" />
              <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.3" />
              <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(200,200,212,0.08)" strokeWidth="0.25" />
            </g>

            {/* Ripple field gradient overlay */}
            <rect x="-4" y="-4" width="56" height="56" fill={`url(#${rippleId})`} className="mercury-ripple-field" />

            {/* Deep shadow */}
            <rect x="0" y="0" width="48" height="48" fill={`url(#${`mq-deep-${uid}`})`} />

            {/* Specular highlight (cursor-tracking) */}
            <rect x="0" y="0" width="48" height="48" fill={`url(#${`mq-sheen-${uid}`})`} />

            {/* Alive orbiting highlight */}
            <g className="mercury-alive-highlight">
              <rect x="0" y="0" width="48" height="48" fill={`url(#${aliveId})`} />
            </g>

            {/* Meniscus surface line */}
            <motion.path
              fill="none"
              stroke="var(--hero-metal-5)"
              strokeWidth="0.9"
              strokeOpacity={0.5}
              initial={false}
              animate={{ d: surfacePath.get() }}
              transition={{ duration: 0.06 }}
              style={{ rotate: surfaceTilt, transformOrigin: "24px 4px" }}
            />
          </motion.g>
        </motion.g>

        {/* Inner rim */}
        <circle cx="24" cy="24" r="21" fill="none" stroke="var(--v-smoke)" strokeWidth="0.5" strokeOpacity="0.22" />
      </svg>

      {/* ═══ DOT → X ICON ═══ */}
      <svg viewBox="0 0 48 48" className="relative h-full w-full" aria-hidden="true">
        <motion.g
          style={{ transformOrigin: "24px 24px" }}
          initial={false}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.circle
            cx="24" cy="24"
            fill="none"
            stroke="var(--v-chalk)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={false}
            animate={{ r: isOpen ? 11 : 3.5 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.line
            x1="18" y1="18" x2="30" y2="30"
            stroke="var(--v-chalk)" strokeWidth="1.2" strokeLinecap="round"
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, pathLength: isOpen ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.line
            x1="30" y1="18" x2="18" y2="30"
            stroke="var(--v-chalk)" strokeWidth="1.2" strokeLinecap="round"
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, pathLength: isOpen ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.g>
      </svg>
    </button>
  );
}
