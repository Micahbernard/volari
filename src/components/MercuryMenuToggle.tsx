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
// MercuryMenuToggle  ✦  gravitational-pool menu trigger
//
// One coherent astral system: three concentric rings pulse at
// distinct phases (gravitational lens), and the mercury inside
// the lens is part of the same physics.
//
// Rest:
//   The vessel is empty. During the rings' major convergence beat
//   (~40 % of the 9 s cycle) a faint mercury ghost flickers into
//   existence for ~200 ms then dissolves back into the void —
//   driven by .lens-ghost in globals.css so it stays exactly in
//   phase with the keyframe-driven rings.
//
// Hover (or focus):
//   Mercury MATERIALISES. Eight particles condense from the rim
//   inward over 320 ms (dust pulled by gravity), converging at
//   the centre. As they fade, the mercury sphere blooms outward
//   from the centre and settles into a full pool. Once active,
//   the sphere ACTS as a lens — its radial-gradient centres
//   (body + specular cap) track the cursor through spring-damped
//   motion values, and the hamburger underneath gets a subtle
//   scale + offset that reads as magnification.
//
// Pointer leave:
//   400 ms grace window — if the cursor returns, the pool is
//   uninterrupted (lingering bulge re-centres). After grace, the
//   pool LOSES COHESION: eight particles fly outward from centre
//   with staggered durations (heavier particles linger), and the
//   sphere fades. The rings continue pulsing alone; the ghost
//   flicker resumes on the next major convergence.
//
// Open:
//   Lens cycle accelerates to 3.5 s; halo pinned at peak. The
//   hamburger morphs to ✕ via the same Framer transforms as
//   before — sits ABOVE the icon-warp group so the X target is
//   never distorted.
//
// Reduced motion:
//   Ring keyframes halt at static mid-brightness (in globals.css);
//   ghost rendered as a faint static silhouette; particle entrance
//   and exit collapse to instant transitions.
// ─────────────────────────────────────────────────────────────

// ─── Particle layout ──────────────────────────────────────────
// 8 particles distributed around the rim at 22.5° offsets from
// cardinal so the ring of dust never reads as a compass.
const PARTICLE_ANGLES_DEG = [
  22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5,
] as const;

const RIM_RADIUS = 21; // viewBox 48×48 → rim sits at r ≈ 22

// Lifecycle phases. Drives the mount/unmount of particles + the
// scale/opacity of the mercury sphere group.
type Phase = "rest" | "enter" | "active" | "exit";

type LensState = "rest" | "hover" | "open";

type MercuryMenuToggleProps = Omit<
  ComponentProps<"button">,
  "onClick" | "type" | "children"
> & {
  /** Controlled open state — drives the hamburger ↔ ✕ morph and
      shifts the lens cycle to its 3.5 s collapse rate. */
  isOpen?: boolean;
  /** Click handler. Receives the *next* open value. */
  onToggle?: (next: boolean) => void;
  /** Forwarded to the underlying <button>. React 19 ref-as-prop. */
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
  // ─── Phase state machine ──────────────────────────────────
  // rest → enter → active → exit → rest
  // Transitions are driven by pointer/focus events with timed
  // hand-offs (320 ms enter, 400 ms grace, 500 ms exit scatter).
  const [phase, setPhase] = useState<Phase>("rest");

  const isActive = phase !== "rest";

  // Lens cycle state (rings duration). Derived from isOpen +
  // isActive. Open beats hover beats rest in the cascade.
  const lensState: LensState = isOpen
    ? "open"
    : isActive
    ? "hover"
    : "rest";

  // ─── Pointer tracking ─────────────────────────────────────
  // px/py are the raw normalised cursor coords (0..1) over the
  // button. cx/cy are spring-smoothed copies so the lens motion
  // glides instead of snapping to every pixel-perfect pointer
  // event.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const cx = useSpring(px, { stiffness: 220, damping: 26, mass: 0.4 });
  const cy = useSpring(py, { stiffness: 220, damping: 26, mass: 0.4 });

  // Intensity ramps 0 → 1 when the lens is active and back to 0
  // when it dissolves. Used to gate the icon magnification so it
  // does not snap on/off — and to give the lens a brief beat of
  // settling-in before the cursor starts driving it.
  const intensity = useSpring(0, { stiffness: 90, damping: 22 });
  useEffect(() => {
    intensity.set(isActive ? 1 : 0);
  }, [isActive, intensity]);

  // ─── Lens distortion derived values ────────────────────────
  // Body + specular gradient centres ride the cursor with
  // different amplitudes so the highlight feels like it's
  // closer to the surface than the body equator.
  const bodyCx = useTransform(cx, (v) => 0.32 + v * 0.36);
  const bodyCy = useTransform(cy, (v) => 0.22 + v * 0.32);
  const sheenCx = useTransform(cx, (v) => 0.30 + v * 0.40);
  const sheenCy = useTransform(cy, (v) => 0.18 + v * 0.30);

  // Hamburger lens magnification — uniform scale + small offset
  // toward the cursor. Subtle: at most ~6 % scale, ~2 px offset
  // on a 48 px button. Reads as "the icon is being magnified by
  // the liquid above it" rather than as a literal warp.
  const offsetX = useTransform(cx, (v) => (v - 0.5) * 4);
  const offsetY = useTransform(cy, (v) => (v - 0.5) * 4);
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
      return 1 + i * Math.max(0, 0.06 - d * 0.08);
    }
  );

  // ─── Stable IDs for SVG defs ──────────────────────────────
  const baseId = useId().replace(/:/g, "-");
  const fillId = `merc-fill-${baseId}`;
  const sheenId = `merc-sheen-${baseId}`;
  const ghostId = `merc-ghost-${baseId}`;

  // ─── Phase transition timers ──────────────────────────────
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (enterTimerRef.current) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (restTimerRef.current) {
      clearTimeout(restTimerRef.current);
      restTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Enter sequence: rest|exit → enter (~320 ms particles) → active
  const beginEnter = useCallback(() => {
    clearTimers();
    setPhase("enter");
    enterTimerRef.current = setTimeout(() => {
      setPhase("active");
      enterTimerRef.current = null;
    }, 320);
  }, [clearTimers]);

  // Exit sequence: 400 ms grace → exit (500 ms scatter) → rest
  // The grace window is what creates the "lingering" feel — if
  // the cursor returns inside the window the pool resumes
  // without re-materialising.
  const beginExit = useCallback(() => {
    clearTimers();
    exitTimerRef.current = setTimeout(() => {
      setPhase("exit");
      exitTimerRef.current = null;
      restTimerRef.current = setTimeout(() => {
        setPhase("rest");
        restTimerRef.current = null;
      }, 500);
    }, 400);
  }, [clearTimers]);

  // Cancel a pending exit (cursor returned inside the grace).
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

  // ─── Event handlers ───────────────────────────────────────
  // pointer events handle mouse/touch/pen uniformly; the caller's
  // listeners (passed through props) compose alongside ours so
  // they always fire — never replaced.

  const handlePointerEnter = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      // Capture cursor position immediately so the lens lands at
      // the cursor on the very first frame instead of at centre.
      const rect = e.currentTarget.getBoundingClientRect();
      px.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
      py.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));

      if (phase === "rest") {
        beginEnter();
      } else {
        // active or exit: cancel any pending dissolve so the
        // pool keeps going.
        cancelExit();
        if (phase === "exit") setPhase("active");
      }

      onPointerEnter?.(e);
    },
    [phase, px, py, beginEnter, cancelExit, onPointerEnter]
  );

  const handlePointerLeave = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      // Spring the lens centre back as the cursor leaves so the
      // dissolve starts from a centred sphere, not an off-axis
      // bulge.
      px.set(0.5);
      py.set(0.5);

      if (phase === "active" || phase === "enter") {
        beginExit();
      }

      onPointerLeave?.(e);
    },
    [phase, px, py, beginExit, onPointerLeave]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (phase === "active") {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        px.set(Math.max(0, Math.min(1, x)));
        py.set(Math.max(0, Math.min(1, y)));
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

  return (
    <button
      // Spread first — caller's pass-through attrs (data-*,
      // aria-controls, aria-label) flow through; component
      // contracts below override.
      {...rest}
      ref={ref}
      data-state={lensState}
      data-phase={phase}
      type="button"
      aria-label={
        rest["aria-label"] ?? (isOpen ? "Close menu" : "Open menu")
      }
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
        "bg-[#0a0a0c] border border-[rgba(55,55,62,0.2)]",
        // Two parallel CSS keyframe animations — border-color
        // (inner ring) and combined box-shadow (mid + outer rings).
        "[animation:lens-border-pulse_9s_ease-in-out_infinite,lens-shadow-pulse_9s_ease-in-out_infinite]",
        "data-[state=hover]:[animation-duration:5s,5s]",
        "data-[state=open]:[animation-duration:3.5s,3.5s]",
        className,
      ].join(" ")}
    >
      {/* ── Halo (4th ring — gravity strengthens) ─────────────
          Dormant at rest. Bleeds in to ~60 % on hover, locks at
          full when open. Sits one pixel outside the rim so the
          inner glow contour rides exactly on the border. */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-[-1px] rounded-full
          opacity-0 transition-opacity duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-data-[state=hover]/lens:opacity-60
          group-data-[state=open]/lens:opacity-100
          [box-shadow:inset_0_0_10px_rgba(220,220,228,0.45),0_0_14px_2px_rgba(220,220,228,0.40)]
          motion-reduce:hidden
        "
      />

      {/* ── Mercury body, particles, ghost — single SVG so they
          all share the same defs (gradients) and clip space.
          inset-1 + h/w-calc keeps the SVG inside the animated
          border — avoids a hairline of black peeking through
          when the border desaturates at its dim phase. */}
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] overflow-hidden rounded-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Sphere body — gradient centre tracks the cursor via
              motion-driven cx/cy. Five stops keep the depth from
              posterising. */}
          <motion.radialGradient
            id={fillId}
            cx={bodyCx as MotionValue<number>}
            cy={bodyCy as MotionValue<number>}
            r="0.85"
          >
            <stop offset="0%" stopColor="#f4f4f8" />
            <stop offset="22%" stopColor="#cdcdd2" />
            <stop offset="48%" stopColor="#8a8a93" />
            <stop offset="74%" stopColor="#4a4a52" />
            <stop offset="100%" stopColor="#1a1a1e" />
          </motion.radialGradient>

          {/* Specular cap — small bright bloom that tracks the
              cursor too, but with a tighter radius so it reads as
              a hot pin-spot rather than a wash. */}
          <motion.radialGradient
            id={sheenId}
            cx={sheenCx as MotionValue<number>}
            cy={sheenCy as MotionValue<number>}
            r="0.30"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </motion.radialGradient>

          {/* Ghost — static gradient, no cursor tracking.
              Centred so the rest-state flicker reads as a
              symmetrical apparition rather than an off-axis
              shadow. */}
          <radialGradient id={ghostId} cx="0.42" cy="0.32" r="0.85">
            <stop offset="0%" stopColor="#cdcdd2" />
            <stop offset="60%" stopColor="#5a5a62" />
            <stop offset="100%" stopColor="#1a1a1e" />
          </radialGradient>
        </defs>

        {/* ── Ghost flicker (rest only) ─────────────────────
            Briefly visible during the rings' major convergence.
            Hidden whenever the lens is in any active phase. */}
        {phase === "rest" && (
          <g className="lens-ghost">
            <circle cx="24" cy="24" r="22" fill={`url(#${ghostId})`} />
          </g>
        )}

        {/* ── Mercury sphere ────────────────────────────────
            Visible in enter/active phases; collapses to scale 0
            during exit. Delay on enter (0.18 s) lets the inbound
            particles converge first so the sphere appears to
            assemble FROM them, not over them. */}
        <motion.g
          initial={false}
          animate={{
            scale: phase === "enter" || phase === "active" ? 1 : 0,
            opacity: phase === "enter" || phase === "active" ? 1 : 0,
          }}
          style={{ transformOrigin: "24px 24px" }}
          transition={
            phase === "enter"
              ? { duration: 0.42, delay: 0.18, ease: [0.22, 1, 0.36, 1] }
              : phase === "exit"
              ? { duration: 0.32, ease: [0.4, 0, 0.6, 1] }
              : { duration: 0.2 }
          }
        >
          <rect width="48" height="48" fill={`url(#${fillId})`} />
          <rect width="48" height="48" fill={`url(#${sheenId})`} />
        </motion.g>

        {/* ── Enter particles (rim → centre) ────────────────
            Eight beads condense from the rim to the centre over
            ~320 ms. Mounted only during the enter phase so the
            initial-to-animate transition fires on every fresh
            entrance, not just the first. The accelerating ease
            (cubic-in-out heavy on the in side) reads as
            gravity. */}
        {phase === "enter" &&
          PARTICLE_ANGLES_DEG.map((angDeg, i) => {
            const ang = (angDeg * Math.PI) / 180;
            const startX = 24 + RIM_RADIUS * Math.cos(ang);
            const startY = 24 + RIM_RADIUS * Math.sin(ang);
            return (
              <motion.circle
                key={`enter-${i}`}
                r={1.3}
                fill="rgba(220,220,228,0.85)"
                initial={{ cx: startX, cy: startY, opacity: 1 }}
                animate={{ cx: 24, cy: 24, opacity: 0 }}
                transition={{
                  duration: 0.32,
                  ease: [0.55, 0, 0.55, 1],
                }}
              />
            );
          })}

        {/* ── Exit particles (centre → outward, staggered) ──
            Mercury loses cohesion. Eight beads fly outward from
            centre with varying durations + delays so heavier
            particles linger — biological, not symmetrical.
            Slight angular offset (8°) breaks the mirror with
            the entrance trajectory. */}
        {phase === "exit" &&
          PARTICLE_ANGLES_DEG.map((angDeg, i) => {
            const ang = ((angDeg + 8) * Math.PI) / 180;
            const exitX = 24 + 32 * Math.cos(ang);
            const exitY = 24 + 32 * Math.sin(ang);
            const stagger = 0.04 + (i % 3) * 0.06;
            const duration = 0.42 + (i % 3) * 0.1;
            const radius = 1.4 - (i % 3) * 0.2;
            return (
              <motion.circle
                key={`exit-${i}`}
                r={radius}
                fill="rgba(220,220,228,0.7)"
                initial={{ cx: 24, cy: 24, opacity: 1 }}
                animate={{ cx: exitX, cy: exitY, opacity: 0 }}
                transition={{
                  duration,
                  delay: stagger,
                  ease: "easeOut",
                }}
              />
            );
          })}
      </svg>

      {/* ── Hamburger ↔ ✕ with lens magnification ─────────────
          The icon group inherits a small scale + offset from
          the cursor, so it reads as being magnified by the
          mercury above. Magnification is gated by `intensity`
          (springs 0→1 with the lens) and decays to 0 at the rim
          so the icon snaps back to true scale when the cursor
          leaves the centre.

          mix-blend-mode: difference inverts the strokes against
          whatever's behind them — silver against the dark rim
          and the deep mercury stops, charcoal against the
          bright specular cap. */}
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
          <motion.g
            initial={false}
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5 : 0 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <line
              x1="16"
              y1="19"
              x2="32"
              y2="19"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </motion.g>

          <motion.g
            initial={false}
            animate={{ scaleX: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <line
              x1="16"
              y1="24"
              x2="32"
              y2="24"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </motion.g>

          <motion.g
            initial={false}
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5 : 0 }}
            style={{ transformOrigin: "24px 24px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <line
              x1="16"
              y1="29"
              x2="32"
              y2="29"
              stroke="#ffffff"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>
      </svg>
    </button>
  );
}
