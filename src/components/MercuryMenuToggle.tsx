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
// MercuryMenuToggle  ✦  Liquid Physics Vessel
//
// A circular crucible of quicksilver driven by real momentum
// physics. The liquid is not CSS — it is an SVG path built
// frame-by-frame inside a requestAnimationFrame loop, with
// spring-damper velocity, overshoot, and organic wobble.
//
//   BASE:    Dark metallic fill rises from the bottom as a
//            viscous column with a wavy meniscus surface.
//   SHIMMER: A bright horizontal band rises slowly through
//            the liquid, catching the ripple crests.
//   SURFACE: 3 sine waves + edge damping create the
//            characteristic liquid metal meniscus.
//   DEPTH:   Overlapping gradients + specular ellipses +
//            SVG filters for glow and bloom.
//
// Idle: Silver heartbeat ring pulses outward.
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

  // ─── Cursor tracking (for specular position) ───────────────
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cx = useSpring(px, { stiffness: 140, damping: 20, mass: 0.55 });
  const cy = useSpring(py, { stiffness: 140, damping: 20, mass: 0.55 });

  // ─── rAF Physics State ────────────────────────────────────
  const fillRef = useRef(0);      // current fill level 0..1
  const targetRef = useRef(0);    // target fill level
  const velocityRef = useRef(0);  // momentum
  const timeRef = useRef(0);      // clock for waves
  const shimmerRef = useRef(0);   // shimmer vertical position 0..1
  const rafRef = useRef<number>(0);

  // ─── React state (updated from rAF) ────────────────────────
  const [fillLevel, setFillLevel] = useState(0);
  const [clock, setClock] = useState(0);
  const [shimmerPos, setShimmerPos] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

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
    targetRef.current = 1;
    enterTimerRef.current = setTimeout(() => { setPhase("active"); enterTimerRef.current = null; }, 500);
  }, [clearTimers]);

  const beginExit = useCallback(() => {
    clearTimers();
    targetRef.current = 0;
    exitTimerRef.current = setTimeout(() => {
      setPhase("exit");
      exitTimerRef.current = null;
      restTimerRef.current = setTimeout(() => { setPhase("rest"); restTimerRef.current = null; }, 420);
    }, 280);
  }, [clearTimers]);

  const cancelExit = useCallback(() => {
    [exitTimerRef, restTimerRef].forEach((r) => { if (r.current) { clearTimeout(r.current); r.current = null; } });
  }, []);

  // ─── Physics rAF loop ──────────────────────────────────────
  const animate = useCallback(() => {
    const diff = targetRef.current - fillRef.current;

    // Spring-damper liquid physics
    const spring = 0.0018;
    const damping = 0.92;
    const maxVel = 0.0045;

    velocityRef.current += diff * spring;
    velocityRef.current *= damping;
    velocityRef.current = Math.max(-maxVel, Math.min(maxVel, velocityRef.current));

    fillRef.current += velocityRef.current;

    // Organic wobble while in motion
    if (Math.abs(velocityRef.current) > 0.0001) {
      fillRef.current += Math.sin(timeRef.current * 2.2) * 0.00008 * Math.sign(velocityRef.current);
    }

    fillRef.current = Math.max(0, Math.min(1, fillRef.current));

    const moving = Math.abs(velocityRef.current) > 0.00005 || Math.abs(diff) > 0.001;
    setIsMoving(moving);

    if (!moving && Math.abs(diff) < 0.001) {
      fillRef.current = targetRef.current;
      velocityRef.current = 0;
    }

    timeRef.current += 0.009;
    setFillLevel(fillRef.current);
    setClock(timeRef.current);

    // Shimmer: slow rise through the liquid
    if (fillRef.current > 0.02) {
      shimmerRef.current += 0.0018;
      if (shimmerRef.current > 1.15) shimmerRef.current = -0.15;
      setShimmerPos(shimmerRef.current);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // ─── Event handlers ────────────────────────────────────────
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

  // ─── Specular position (cursor-driven) ──────────────────────
  const specX = useTransform(cx, (v) => 18 + v * 12);
  const specY = useTransform(cy, (v) => 18 + v * 12);

  // ─── Liquid Path Builder ───────────────────────────────────
  // Builds an SVG path that fills the circle from bottom up,
  // with a wavy meniscus surface at the top.
  const buildLiquidPath = useCallback(() => {
    if (fillLevel < 0.005) return "";

    const bottomY = 46;
    const topY = bottomY - fillLevel * 44;
    const steps = 50;
    const waveAmp = isMoving ? 2.0 + fillLevel * 1.5 : 0.8 + fillLevel * 0.5;
    const t = clock;

    let d = `M 2 ${bottomY} `;

    // Left wall: UP from bottom
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const y = bottomY - frac * (bottomY - topY);
      d += `L 2 ${y.toFixed(1)} `;
    }

    // Wavy top surface
    const surfaceSteps = 60;
    const surfacePoints: [number, number][] = [];
    for (let i = 0; i <= surfaceSteps; i++) {
      const frac = i / surfaceSteps;
      const x = 2 + frac * 44;
      const wave1 = Math.sin(frac * Math.PI * 4 + t * 1.2) * waveAmp;
      const wave2 = Math.sin(frac * Math.PI * 7 + t * 1.9 + 1.2) * waveAmp * 0.35;
      const wave3 = Math.sin(frac * Math.PI * 2 + t * 0.7 + 2.5) * waveAmp * 0.2;
      const edgeDamp = Math.sin(frac * Math.PI);
      const y = topY + (wave1 + wave2 + wave3) * edgeDamp;
      surfacePoints.push([x, y]);
    }

    d += `L ${surfacePoints[0][0].toFixed(1)} ${surfacePoints[0][1].toFixed(1)} `;
    for (let i = 1; i < surfacePoints.length - 1; i++) {
      const cpx = surfacePoints[i][0];
      const cpy = surfacePoints[i][1];
      const nx = (surfacePoints[i][0] + surfacePoints[i + 1][0]) / 2;
      const ny = (surfacePoints[i][1] + surfacePoints[i + 1][1]) / 2;
      d += `Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)} `;
    }
    const last = surfacePoints[surfacePoints.length - 1];
    d += `L ${last[0].toFixed(1)} ${last[1].toFixed(1)} `;

    // Right wall: DOWN to bottom
    for (let i = steps; i >= 0; i--) {
      const frac = i / steps;
      const y = bottomY - frac * (bottomY - topY);
      d += `L 46 ${y.toFixed(1)} `;
    }

    d += "Z";
    return d;
  }, [fillLevel, isMoving, clock]);

  // ─── Surface Highlight Path ────────────────────────────────
  const buildSurfaceHighlight = useCallback(() => {
    if (fillLevel < 0.01) return "";
    const bottomY = 46;
    const topY = bottomY - fillLevel * 44;
    const t = clock;
    const amp = isMoving ? 1.6 : 0.6;
    let d = "";
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const frac = i / steps;
      const x = 2 + frac * 44;
      const wave = Math.sin(frac * Math.PI * 4 + t * 1.2 + 0.5) * amp * Math.sin(frac * Math.PI);
      const y = topY + wave;
      d += (i === 0 ? "M" : "L") + ` ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d;
  }, [fillLevel, isMoving, clock]);

  // ─── Shimmer Path ──────────────────────────────────────────
  const buildShimmerPath = useCallback(() => {
    if (fillLevel < 0.03) return null;
    const bottomY = 46;
    const topY = bottomY - fillLevel * 44;
    const liquidHeight = bottomY - topY;
    const shimmerY = bottomY - shimmerPos * liquidHeight;
    if (shimmerY < topY - 5 || shimmerY > bottomY + 5) return null;
    const bandHeight = 10;
    const sy = Math.max(topY + 2, Math.min(bottomY - 2, shimmerY));
    const topBand = sy - bandHeight / 2;
    const botBand = sy + bandHeight / 2;
    const d = `M 2 ${botBand.toFixed(1)} L 2 ${topBand.toFixed(1)} L 46 ${topBand.toFixed(1)} L 46 ${botBand.toFixed(1)} Z`;
    return { d, centerY: sy };
  }, [fillLevel, shimmerPos]);

  // ─── Droplets ──────────────────────────────────────────────
  const buildDroplets = useCallback(() => {
    if (fillLevel < 0.08) return [];
    const bottomY = 46;
    const topY = bottomY - fillLevel * 44;
    const t = clock;
    const droplets: Array<{ cx: number; cy: number; r: number; opacity: number }> = [];
    const count = Math.floor(fillLevel * 5) + 1;
    for (let i = 0; i < count; i++) {
      const seed = i * 97.3 + 13;
      const xFrac = (Math.sin(seed) * 0.5 + 0.5);
      const x = 4 + xFrac * 40;
      const bobY = Math.sin(t * (0.6 + i * 0.2) + seed) * 2;
      const y = topY + 2 + bobY;
      droplets.push({
        cx: x + Math.sin(t * 0.4 + seed) * 1.5,
        cy: y,
        r: 1.2 + Math.sin(seed * 3.1) * 0.5,
        opacity: (0.4 + Math.sin(t * 0.8 + seed) * 0.2) * fillLevel,
      });
    }
    return droplets;
  }, [fillLevel, clock]);

  const liquidPath = buildLiquidPath();
  const surfaceHighlight = buildSurfaceHighlight();
  const droplets = buildDroplets();
  const shimmer = buildShimmerPath();

  // ─── Stable SVG IDs ───────────────────────────────────────
  const uid = useRef(`mq-${Math.random().toString(36).slice(2, 9)}`).current;
  const liquidAlpha = 0.65;

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

      {/* ═══ GOLD BLOOM ═══ */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-3px] rounded-full"
        initial={false}
        animate={{ opacity: isActive ? 0.5 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ boxShadow: "0 0 28px 8px var(--accent-glow-soft)" }}
      />

      {/* ═══ LIQUID MERCURY VESSEL (SVG with rAF physics) ═══ */}
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] overflow-hidden rounded-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Clip to circle */}
          <clipPath id={`mq-clip-${uid}`}>
            <circle cx="24" cy="24" r="22" />
          </clipPath>

          {/* Main mercury body gradient */}
          <linearGradient id={`mq-body-${uid}`} x1="20%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#3a3a48" />
            <stop offset="15%" stopColor="#5a5a6e" />
            <stop offset="30%" stopColor="#8a8aa0" />
            <stop offset="45%" stopColor="#b8b8cc" />
            <stop offset="60%" stopColor="#d8d8e8" />
            <stop offset="75%" stopColor="#c0c0d4" />
            <stop offset="90%" stopColor="#e4e4f0" />
            <stop offset="100%" stopColor="#f0f0fa" />
          </linearGradient>

          {/* Deep shadow layer */}
          <linearGradient id={`mq-deep-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="20%" stopColor="#2e2e44" />
            <stop offset="40%" stopColor="#4a4a66" />
            <stop offset="60%" stopColor="#7a7a98" />
            <stop offset="80%" stopColor="#a8a8c4" />
            <stop offset="100%" stopColor="#d0d0e4" />
          </linearGradient>

          {/* Specular highlight */}
          <radialGradient id={`mq-spec-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#e8e8f8" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#b0b0cc" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#686880" stopOpacity="0" />
          </radialGradient>

          {/* Cool secondary reflection */}
          <radialGradient id={`mq-spec-cool-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c8c8e8" stopOpacity="0.5" />
            <stop offset="40%" stopColor="#9090b0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#50506a" stopOpacity="0" />
          </radialGradient>

          {/* Shimmer gradient */}
          <linearGradient id={`mq-shimmer-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0e0f0" stopOpacity="0" />
            <stop offset="25%" stopColor="#e8e8f8" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#f4f4ff" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#e8e8f8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e0e0f0" stopOpacity="0" />
          </linearGradient>

          {/* Droplet gradient */}
          <radialGradient id={`mq-drop-${uid}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#d8d8ec" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#8888a4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3a3a50" stopOpacity="0.3" />
          </radialGradient>

          {/* Surface meniscus gradient */}
          <linearGradient id={`mq-surface-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a0a0b8" />
            <stop offset="15%" stopColor="#d0d0e4" />
            <stop offset="30%" stopColor="#f0f0ff" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f0f0ff" />
            <stop offset="85%" stopColor="#d0d0e4" />
            <stop offset="100%" stopColor="#a0a0b8" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`mq-glow-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b" />
            <feFlood floodColor="#b0b0d0" floodOpacity={fillLevel > 0.1 ? 0.35 : 0} result="c" />
            <feComposite in="c" in2="b" operator="in" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Specular bloom */}
          <filter id={`mq-bloom-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shimmer blur */}
          <filter id={`mq-shimmer-blur-${uid}`} x="-20%" y="-10%" width="140%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft blur */}
          <filter id={`mq-soft-${uid}`}>
            <feGaussianBlur stdDeviation="0.2" />
          </filter>
        </defs>

        {/* Ghost at rest */}
        {phase === "rest" && (
          <g className="lens-ghost">
            <circle cx="24" cy="24" r="19" fill="var(--v-smoke)" fillOpacity="0.10" />
          </g>
        )}

        {/* Liquid body (clipped to circle) */}
        <g clipPath={`url(#mq-clip-${uid})`}>
          {liquidPath && (
            <g filter={fillLevel > 0.08 ? `url(#mq-glow-${uid})` : undefined}>
              {/* Deep shadow */}
              <path d={liquidPath} fill={`url(#mq-deep-${uid})`} opacity={liquidAlpha * 0.6} />
              {/* Main body */}
              <path d={liquidPath} fill={`url(#mq-body-${uid})`} opacity={liquidAlpha} />
              {/* Primary specular */}
              {fillLevel > 0.12 && (
                <motion.ellipse
                  cx={specX as MotionValue<number>}
                  cy={specY as MotionValue<number>}
                  rx={12 + fillLevel * 6}
                  ry={8 + fillLevel * 5}
                  fill={`url(#mq-spec-${uid})`}
                  opacity={0.55}
                  filter={`url(#mq-bloom-${uid})`}
                />
              )}
              {/* Cool secondary reflection */}
              {fillLevel > 0.2 && (
                <ellipse
                  cx={24 + 6}
                  cy={24 - 6}
                  rx={8}
                  ry={6}
                  fill={`url(#mq-spec-cool-${uid})`}
                  opacity={0.3}
                />
              )}
              {/* Shimmer band */}
              {shimmer && fillLevel > 0.03 && (
                <path
                  d={shimmer.d}
                  fill={`url(#mq-shimmer-${uid})`}
                  opacity={liquidAlpha * 0.7}
                  filter={`url(#mq-shimmer-blur-${uid})`}
                />
              )}
            </g>
          )}

          {/* Surface highlight (meniscus) */}
          {surfaceHighlight && (
            <>
              <path d={surfaceHighlight} fill="none" stroke="#d8d8f0" strokeWidth="5" strokeLinecap="round" opacity={0.12 * fillLevel} />
              <path d={surfaceHighlight} fill="none" stroke={`url(#mq-surface-${uid})`} strokeWidth="2" strokeLinecap="round" opacity={0.85 * fillLevel} />
              <path d={surfaceHighlight} fill="none" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" opacity={0.45 * fillLevel} />
            </>
          )}

          {/* Droplets */}
          {droplets.map((d, i) => (
            <circle key={`drop-${i}`} cx={d.cx} cy={d.cy} r={d.r} fill={`url(#mq-drop-${uid})`} opacity={d.opacity} />
          ))}
        </g>

        {/* Inner rim */}
        <circle cx="24" cy="24" r="21" fill="none" stroke="var(--v-smoke)" strokeWidth="0.5" strokeOpacity="0.22" />
      </svg>

      {/* ═══ DOT → X ICON ═══ */}
      <svg viewBox="0 0 48 48" className="relative h-full w-full" aria-hidden="true" style={{ zIndex: 10 }}>
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
