"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ComponentProps,
  FocusEvent as ReactFocusEvent,
  PointerEvent as ReactPointerEvent,
  Ref,
} from "react";

// ─────────────────────────────────────────────────────────────
// MercuryMenuToggle  ✦  Alchemical Vessel
//
// A crucible of quicksilver — the navbar's ritual instrument.
// Inspired by the site's "Modern Mystic" identity: mercury is
// one of the three primes (sulphur, salt, mercury) and the
// volatile agent of transformation. The button embodies this
// philosophy — a sealed vessel that, on approach, reveals its
// living contents.
//
// Rest:
//   A dark crucible of gunmetal and obsidian. Through the
//   glass, a faint silhouette of mercury haunts the chamber
//   — a ghost that flickers at the gravitational convergence
//   beat (CSS lens-ghost-flicker, 9s cycle). Three concentric
//   rings pulse around the rim: inner border, tight halo,
//   wide halo — each at a distinct phase, producing a
//   lensing distortion that reads as gravitational pull.
//
// Hover:
//   The vessel WARMS. Quicksilver floods upward from the
//   base as a liquid column — not a flat sphere, but a
//   heavy metal with surface tension. The meniscus line
//   (where mercury meets the void) glows with a thin
//   silver ring. A specular highlight rides the surface,
//   shifting with the cursor to create 3D volume.
//
//   The hamburger icon magnifies subtly through the liquid
//   lens — offset + scale driven by cursor proximity.
//
//   A faint gold accent blooms at the rim, referencing the
//   site's accent token (#d4a853) but kept subordinate so
//   the mercury remains the protagonist.
//
// Open:
//   Ring cycle collapses to 3.5s. Halo locks at peak.
//   Hamburger morphs to ✕. Mercury holds its level —
//   the vessel is in active use.
//
// Theme (daybreak):
//   All mercury stops swap to warm brass via CSS variables.
//   The ghost becomes umber; the specular warms to champagne.
//   No JS logic required — the theme flip is pure CSS.
//
// Reduced motion:
//   Static mercury at 40% opacity. No flicker, no rise
//   animation, no particles. Cursor tracking disabled.
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
    }, 380);
  }, [clearTimers]);

  const beginExit = useCallback(() => {
    clearTimers();
    exitTimerRef.current = setTimeout(() => {
      setPhase("exit");
      exitTimerRef.current = null;
      restTimerRef.current = setTimeout(() => {
        setPhase("rest");
        restTimerRef.current = null;
      }, 450);
    }, 350);
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
      if (phase === "rest") beginEnter();
      else { cancelExit(); if (phase === "exit") setPhase("active"); }
      onPointerEnter?.(e);
    },
    [phase, beginEnter, cancelExit, onPointerEnter]
  );

  const handlePointerLeave = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (phase === "active" || phase === "enter") beginExit();
      onPointerLeave?.(e);
    },
    [phase, beginExit, onPointerLeave]
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

  // ─── SVG gradient IDs (stable per instance) ────────────────
  const uid = useRef(`merc-${Math.random().toString(36).slice(2, 9)}`).current;
  const bodyId = `merc-body-${uid}`;
  const sheenId = `merc-sheen-${uid}`;
  const deepId = `merc-deep-${uid}`;
  const ghostId = `merc-ghost-${uid}`;

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
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={[
        "lens-button group/lens relative inline-flex h-12 w-12 shrink-0",
        "items-center justify-center rounded-full",
        "outline-none cursor-pointer select-none touch-manipulation",
        "bg-[var(--v-void)] border",
        "transition-colors duration-500",
        "[animation:lens-border-pulse_9s_ease-in-out_infinite,lens-shadow-pulse_9s_ease-in-out_infinite]",
        "data-[state=hover]:[animation-duration:5s,5s]",
        "data-[state=open]:[animation-duration:3.5s,3.5s]",
        className,
      ].join(" ")}
    >
      {/* ── Outer halo — gravitational lens glow ──────────────── */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-[-1px] rounded-full
          opacity-0 transition-opacity duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-data-[state=hover]/lens:opacity-60
          group-data-[state=open]/lens:opacity-100
          motion-reduce:hidden
        "
        style={{
          boxShadow: "inset 0 0 14px rgba(200,200,212,0.40), 0 0 18px 3px rgba(200,200,212,0.30)",
        }}
      />

      {/* ── Gold accent bloom (subtle — only on hover) ──────── */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-[-2px] rounded-full
          opacity-0 transition-opacity duration-[900ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-data-[state=hover]/lens:opacity-100
          group-data-[state=open]/lens:opacity-100
        "
        style={{
          boxShadow: "0 0 20px 4px var(--accent-glow-soft), 0 0 40px 8px var(--accent-glow-soft)",
        }}
      />

      {/* ── Mercury vessel — single SVG ─────────────────────── */}
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] overflow-hidden rounded-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* 
            MERCURY BODY — 9-stop metallic gradient.
            Uses the same stops as the hero VOLARI text so the
            button feels like a piece of the same material.
            On void: cool steel. On daybreak: warm brass.
            The gradient runs diagonally (135deg) so the metal
            reads as having depth and grain.
          */}
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

          {/* 
            DEEP SHADOW — beneath the surface.
            Creates the illusion that mercury has weight
            and sits at the bottom of the vessel.
          */}
          <radialGradient id={deepId} cx="35%" cy="75%" r="65%">
            <stop offset="0%" stopColor="rgba(5,5,8,0.55)" />
            <stop offset="40%" stopColor="rgba(8,8,14,0.30)" />
            <stop offset="100%" stopColor="rgba(10,10,18,0)" />
          </radialGradient>

          {/* 
            SPECULAR CAP — the bright reflection on the liquid surface.
            Offset to upper-left so the metal reads as illuminated
            from above. Small radius for a razor-sharp highlight.
          */}
          <radialGradient id={sheenId} cx="32%" cy="28%" r="28%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.90)" />
            <stop offset="30%" stopColor="rgba(240,240,248,0.50)" />
            <stop offset="65%" stopColor="rgba(220,220,232,0.10)" />
            <stop offset="100%" stopColor="rgba(220,220,232,0)" />
          </radialGradient>

          {/* 
            GHOST — the haunting silhouette at rest.
            Centred, dim, desaturated. Briefly materialises
            during the ring convergence beat via CSS animation.
          */}
          <radialGradient id={ghostId} cx="42%" cy="38%" r="82%">
            <stop offset="0%" stopColor="var(--hero-metal-4)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="var(--hero-metal-2)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--hero-metal-0)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Ghost flicker (rest only) ───────────────────── */}
        {phase === "rest" && (
          <g className="lens-ghost">
            <circle cx="24" cy="24" r="21" fill={`url(#${ghostId})`} />
          </g>
        )}

        {/* ── Mercury liquid body ─────────────────────────── */}
        <motion.g
          initial={false}
          animate={{
            scale: phase === "enter" || phase === "active" ? 1 : 0.88,
            opacity: phase === "enter" || phase === "active" ? 1 : 0,
          }}
          style={{ transformOrigin: "24px 26px" }}
          transition={
            phase === "enter"
              ? { duration: 0.55, delay: 0.10, ease: [0.22, 1, 0.36, 1] }
              : phase === "exit"
              ? { duration: 0.35, ease: [0.4, 0, 0.6, 1] }
              : { duration: 0.2 }
          }
        >
          {/* Base metal */}
          <rect x="0" y="0" width="48" height="48" fill={`url(#${bodyId})`} />
          {/* Deep shadow for weight */}
          <rect x="0" y="0" width="48" height="48" fill={`url(#${deepId})`} />
          {/* Specular highlight */}
          <rect x="0" y="0" width="48" height="48" fill={`url(#${sheenId})`} />
        </motion.g>

        {/* 
          MENISCUS — the surface tension line.
          A thin bright ring where mercury meets the void.
          Only visible when the liquid is present.
        */}
        <motion.circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="var(--hero-metal-5)"
          strokeWidth="0.7"
          strokeOpacity={0.35}
          initial={false}
          animate={{
            opacity: phase === "enter" || phase === "active" ? 1 : 0,
          }}
          transition={
            phase === "enter"
              ? { duration: 0.45, delay: 0.20, ease: [0.22, 1, 0.36, 1] }
              : phase === "exit"
              ? { duration: 0.25, ease: [0.4, 0, 0.6, 1] }
              : { duration: 0.15 }
          }
        />

        {/* 
          INNER RIM — vessel wall highlight.
          Creates the illusion of glass or polished obsidian
          containing the mercury.
        */}
        <circle
          cx="24"
          cy="24"
          r="21.5"
          fill="none"
          stroke="var(--v-smoke)"
          strokeWidth="0.5"
          strokeOpacity={0.3}
        />
      </svg>

      {/* ── Hamburger ↔ ✕ — above the mercury ─────────────── */}
      <svg
        viewBox="0 0 48 48"
        className="relative h-full w-full"
        aria-hidden="true"
      >
        <motion.g
          style={{
            transformOrigin: "24px 24px",
            mixBlendMode: "difference",
          }}
          initial={false}
          animate={{
            scale: isActive ? 1.04 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top line → \ */}
          <motion.g
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5 : 0 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <line
              x1="16" y1="19" x2="32" y2="19"
              stroke="var(--v-chalk)" strokeWidth="1.1" strokeLinecap="round"
            />
          </motion.g>

          {/* Middle line → fades */}
          <motion.g
            initial={false}
            animate={{ scaleX: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <line
              x1="16" y1="24" x2="32" y2="24"
              stroke="var(--v-chalk)" strokeWidth="1.1" strokeLinecap="round"
            />
          </motion.g>

          {/* Bottom line → / */}
          <motion.g
            initial={false}
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5 : 0 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <line
              x1="16" y1="29" x2="32" y2="29"
              stroke="var(--v-chalk)" strokeWidth="1.1" strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
      </svg>
    </button>
  );
}
