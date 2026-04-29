"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Sparkles, Layers, Zap, Eye } from "lucide-react";
import { useLenis } from "@/providers/SmoothScrollProvider";
import AbyssalCanvas from "./AbyssalCanvas";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// ConvergenceSection ✦ The Convergence
//
// ARCHITECTURAL MANDATE — DO NOT BREAK THIS LAYERING:
//   1. <AbyssalCanvas> is FIRST child: absolute inset-0 z-0,
//      pointer-events-none. It fills the entire section behind.
//   2. All DOM content is in a sibling wrapper: relative z-10.
//      This ensures the WebGL void renders behind, and the DOM
//      captures all pointer events.
//   3. Mouse coordinates are tracked globally via window listener
//      and fed to the shader through refs. No R3F pointer events.
//
// The void creeps from edges. The cursor burns it away. The cards
// are liquid mercury — their backdrop-filters distort the void.
// ─────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: "ethos",
    icon: Sparkles,
    title: "Digital Alchemy",
    body: "We transmute raw ideas into living digital experiences. Every pixel placed with intent. Every animation tuned to the millisecond. The result feels inevitable — as if it could not have been designed any other way.",
    tags: ["Strategy", "Brand", "Vision"],
  },
  {
    id: "craft",
    icon: Layers,
    title: "Obsessive Craft",
    body: "No templates. No shortcuts. Custom shaders, spring physics, scroll-driven choreography written by hand. Performance is not an afterthought — it is the foundation upon which everything else is built.",
    tags: ["Next.js", "WebGL", "GSAP"],
  },
  {
    id: "motion",
    icon: Zap,
    title: "Kinetic Design",
    body: "Motion is communication, not decoration. We architect movement systems that guide attention, reward interaction, and create emotional resonance. From micro-interactions to cinematic transitions.",
    tags: ["Animation", "3D", "Interaction"],
  },
  {
    id: "vision",
    icon: Eye,
    title: "Future Sight",
    body: "We build for what is coming, not what is comfortable. Real-time 3D, generative AI, spatial computing — evaluated, prototyped, and deployed when they serve the work. Explorers, not tourists.",
    tags: ["R&D", "Innovation", "Emerging"],
  },
] as const;

// ─── Liquid Mercury Card ───
function MercuryCard({
  card,
  index,
  onHover,
  onLeave,
}: {
  card: (typeof CARDS)[number];
  index: number;
  onHover: () => void;
  onLeave: () => void;
}) {
  const Icon = card.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for liquid specular tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 180, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Specular highlight position
  const specX = useTransform(smoothX, [-0.5, 0.5], [70, 30]);
  const specY = useTransform(smoothY, [-0.5, 0.5], [70, 30]);
  const shine = useTransform(
    [smoothX, smoothY],
    ([x, y]) => Math.max(0, 1.0 - Math.sqrt((x as number) ** 2 + (y as number) ** 2) * 1.3)
  );

  // 3D tilt
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);

  // Memoized specular gradient string
  const specularBg = useTransform(
    [specX, specY, shine],
    ([x, y, s]) => {
      const intensity = Math.max(0.04, (s as number) * 0.14);
      return `radial-gradient(ellipse 170% 150% at ${x as number}% ${y as number}%, rgba(230,210,170,${intensity.toFixed(3)}) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)`;
    }
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handlePointerEnter = useCallback(() => {
    onHover();
  }, [onHover]);

  const handlePointerLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    onLeave();
  }, [mouseX, mouseY, onLeave]);

  return (
    <motion.div
      ref={cardRef}
      data-card-reveal
      className="group relative min-w-[300px] max-w-[360px] shrink-0 cursor-pointer sm:min-w-[340px] sm:max-w-[400px]"
      style={{ perspective: 900 }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="relative overflow-hidden rounded-md p-6 sm:p-8"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          backdropFilter: "blur(16px) saturate(160%) brightness(0.85)",
          WebkitBackdropFilter: "blur(16px) saturate(160%) brightness(0.85)",
          background:
            "linear-gradient(170deg, rgba(22,22,28,0.75) 0%, rgba(10,10,16,0.55) 50%, rgba(6,6,12,0.65) 100%)",
          boxShadow:
            "inset 0 1px 1px rgba(255,255,255,0.06), inset 0 -1px 1px rgba(0,0,0,0.4), 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {/* Liquid mercury specular highlight — tracks mouse */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: specularBg }}
        />

        {/* Top rim light — mercury edge glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: "inset 0 1px 0 rgba(212,168,83,0.12), inset 0 -1px 0 rgba(0,0,0,0.35)",
          }}
        />

        {/* Corner accent marks */}
        <div className="pointer-events-none absolute top-2.5 right-2.5 h-5 w-5 border-t border-r border-v-accent/0 transition-colors duration-500 group-hover:border-v-accent/25" />
        <div className="pointer-events-none absolute bottom-2.5 left-2.5 h-5 w-5 border-b border-l border-v-accent/0 transition-colors duration-500 group-hover:border-v-accent/25" />

        {/* Icon */}
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-sm border border-v-smoke/15 bg-v-black/50">
          <Icon
            className="h-5 w-5 text-v-accent/60 transition-colors duration-500 group-hover:text-v-accent"
            strokeWidth={1.2}
          />
        </div>

        {/* Content */}
        <h3 className="font-[family-name:var(--font-playfair)] text-[1.35rem] tracking-[-0.01em] text-v-chalk sm:text-[1.5rem]">
          {card.title}
        </h3>
        <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.85] tracking-[0.01em] text-v-silver/60">
          {card.body}
        </p>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-v-smoke/12 bg-v-black/40 px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.22em] text-v-silver/45 transition-colors duration-300 group-hover:border-v-smoke/22 group-hover:text-v-silver/65"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Index number */}
        <span className="pointer-events-none absolute bottom-5 right-6 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.15em] text-v-smoke/15">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Convergence Section ───
export default function ConvergenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Shader uniform refs — zero React re-renders
  const scrollProgressRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lightPulseRef = useRef(0);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });

  // ── Global mouse tracker → feeds shader via ref ──
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Lenis scroll → shader bridge ──
  useEffect(() => {
    if (!lenis) return;
    const onScroll = (e: { velocity: number }) => {
      scrollVelocityRef.current = e.velocity * 0.008;
    };
    lenis.on("scroll", onScroll);
    return () => { lenis.off("scroll", onScroll); };
  }, [lenis]);

  // ── Card hover → light pulse burst ──
  const handleCardHover = useCallback(() => {
    lightPulseRef.current = 1.0;
  }, []);

  const handleCardLeave = useCallback(() => {
    // Pulse decays naturally in the rAF loop
  }, []);

  // ── GSAP macro animations ──
  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Pin the section
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${track.scrollWidth - window.innerWidth + 500}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgressRef.current = Math.min(self.progress * 1.35, 1.0);
        },
      });

      // Horizontal scrub
      const horizontalScroll = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 120),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + 500}`,
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      // Heading reveal
      if (headingRef.current) {
        const els = headingRef.current.querySelectorAll("[data-reveal]");
        gsap.fromTo(
          els,
          { clipPath: "inset(0 100% 0 0)", opacity: 0, y: 20 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Card entrance
      const cards = track.querySelectorAll("[data-card-reveal]");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.2, scale: 0.88, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: "left 88%",
              end: "left 45%",
              scrub: true,
            },
          }
        );
      });

      return () => { pinTrigger.kill(); };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="convergence"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--v-void)" }}
    >
      {/* ═══════════════════════════════════════════════════════
          LAYER 0: THE VOID — WebGL Canvas
          absolute, inset-0, z-index: 0, pointer-events: none
          The shader renders here. It cannot intercept clicks.
          ═══════════════════════════════════════════════════════ */}
      <AbyssalCanvas
        scrollProgressRef={scrollProgressRef}
        scrollVelocityRef={scrollVelocityRef}
        lightPulseRef={lightPulseRef}
        mousePosRef={mousePosRef}
      />

      {/* ═══════════════════════════════════════════════════════
          LAYER 1: THE DOM — All content
          relative, z-index: 10
          This sits ON TOP of the void. All interaction happens here.
          The cards' backdrop-filters distort the void behind them.
          ═══════════════════════════════════════════════════════ */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* Top rule */}
        <div className="flex justify-center px-6 pt-16 md:px-10 md:pt-20">
          <div className="h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-v-smoke/25 to-transparent" />
        </div>

        {/* Heading */}
        <div ref={headingRef} className="px-6 pb-16 pt-20 md:px-10 md:pb-20 md:pt-28">
          <div className="mx-auto max-w-[90rem]">
            <span
              data-reveal
              className="mb-4 block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.5em] text-v-accent/60"
              style={{ opacity: 0 }}
            >
              004 — The Convergence
            </span>
            <div className="flex items-center gap-5 md:gap-8">
              <div
                data-reveal
                className="hidden h-px w-12 bg-gradient-to-r from-v-accent/30 to-transparent md:block"
                style={{ opacity: 0 }}
              />
              <h2
                data-reveal
                className="font-[family-name:var(--font-playfair)] text-[clamp(2.2rem,5.5vw,5rem)] leading-[1.05] tracking-[-0.02em] text-v-chalk"
                style={{ opacity: 0 }}
              >
                Where light{" "}
                <span className="italic text-v-accent">prevails</span>
              </h2>
            </div>
            <p
              data-reveal
              className="mt-4 max-w-md font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.9] tracking-[0.02em] text-v-silver/60 md:text-xs"
              style={{ opacity: 0 }}
            >
              Scroll into the convergence. Four pillars define the Volari
              ethos — hover each to push back the darkness.
            </p>
          </div>
        </div>

        {/* Horizontal card track */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-5 px-6 pb-32 will-change-transform md:gap-7 md:px-10"
        >
          {CARDS.map((card, i) => (
            <MercuryCard
              key={card.id}
              card={card}
              index={i}
              onHover={handleCardHover}
              onLeave={handleCardLeave}
            />
          ))}
          <div className="w-[20vw] shrink-0" aria-hidden="true" />
        </div>

        {/* Bottom edge fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-v-void to-transparent" />
      </div>
    </section>
  );
}
