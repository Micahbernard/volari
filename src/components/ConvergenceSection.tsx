"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Sparkles, Layers, Zap, Eye } from "lucide-react";
import { useLenis } from "@/providers/SmoothScrollProvider";
import AbyssalCanvas from "./AbyssalCanvas";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// ConvergenceSection ✦ Scroll-Triggered WebGL & DOM Interplay
//
// Pins in place on scroll. The background shader's darkness
// encroaches from edges as the user scrolls through. Mouse
// acts as a light repulsor. Four liquid mercury cards translate
// in from the right with stagger. Hovering a card pulses light
// that momentarily pushes the shadow back.
// ─────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: "ethos",
    icon: Sparkles,
    title: "Digital Alchemy",
    body: "We transmute raw ideas into living digital experiences. Every pixel is placed with intent, every animation tuned to the millisecond. The result is work that feels inevitable — as if it could not have been designed any other way.",
    tags: ["Strategy", "Brand", "Vision"],
  },
  {
    id: "craft",
    icon: Layers,
    title: "Obsessive Craft",
    body: "No templates. No shortcuts. We write every line of frontend code by hand — custom shaders, spring physics, scroll-driven choreography. Performance is not an afterthought; it is the foundation upon which everything else is built.",
    tags: ["Next.js", "WebGL", "GSAP"],
  },
  {
    id: "motion",
    icon: Zap,
    title: "Kinetic Design",
    body: "Motion is not decoration — it is communication. We design movement systems that guide attention, reward interaction, and create emotional resonance. From micro-interactions to cinematic page transitions, every motion tells a story.",
    tags: ["Animation", "3D", "Interaction"],
  },
  {
    id: "vision",
    icon: Eye,
    title: "Future Sight",
    body: "We build for what is coming, not what is comfortable. Emerging technologies — real-time 3D, generative AI, spatial computing — are evaluated, prototyped, and deployed when they serve the work. We are explorers, not tourists.",
    tags: ["R&D", "Innovation", "Emerging"],
  },
] as const;

// ─── Liquid mercury card component ───
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

  // Motion values for liquid mercury reflection tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse position into highlight/shadow offsets
  const highlightX = useTransform(smoothX, [-0.5, 0.5], ["60%", "40%"]);
  const highlightY = useTransform(smoothY, [-0.5, 0.5], ["60%", "40%"]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);

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
      className="group relative min-w-[320px] max-w-[380px] shrink-0 cursor-pointer md:min-w-[360px]"
      initial={{ opacity: 0, x: 120 }}
      style={{ perspective: 800 }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="relative overflow-hidden rounded-lg border border-v-smoke/10 p-7 md:p-8"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          backdropFilter: "blur(12px) saturate(140%)",
          WebkitBackdropFilter: "blur(12px) saturate(140%)",
          background:
            "linear-gradient(135deg, rgba(15,15,20,0.65) 0%, rgba(8,8,14,0.45) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.35)",
        }}
      >
        {/* Liquid mercury specular highlight — tracks mouse */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: useTransform(
              [highlightX, highlightY],
              ([x, y]) =>
                `radial-gradient(ellipse 140% 120% at ${x} ${y}, rgba(212,168,83,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)`
            ),
          }}
        />

        {/* Inner rim light — top edge */}
        <div
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: "inset 0 1px 0 rgba(212,168,83,0.15)",
          }}
        />

        {/* Corner accent marks */}
        <div className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t border-r border-v-accent/0 transition-colors duration-500 group-hover:border-v-accent/30" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-v-accent/0 transition-colors duration-500 group-hover:border-v-accent/30" />

        {/* Icon */}
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-sm border border-v-smoke/20 bg-v-black/40">
          <Icon
            className="h-5 w-5 text-v-accent/70 transition-colors duration-500 group-hover:text-v-accent"
            strokeWidth={1.2}
          />
        </div>

        {/* Content */}
        <h3 className="font-[family-name:var(--font-playfair)] text-xl tracking-[-0.01em] text-v-chalk md:text-2xl">
          {card.title}
        </h3>
        <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.8] tracking-[0.01em] text-v-silver/65">
          {card.body}
        </p>

        {/* Tags */}
        <div className="mt-5 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-v-smoke/15 bg-v-black/30 px-2.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.2em] text-v-silver/50 transition-colors duration-300 group-hover:border-v-smoke/25 group-hover:text-v-silver/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Number */}
        <span className="pointer-events-none absolute bottom-4 right-5 font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.15em] text-v-smoke/20">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main section ───
export default function ConvergenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Shader uniform refs — mutated directly, no re-renders
  const scrollProgressRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const lightPulseRef = useRef(0);

  // Local pulse trigger state for GSAP
  const [pulseKey, setPulseKey] = useState(0);

  // Lenis scroll → shader uniform bridge
  useEffect(() => {
    if (!lenis) return;

    const onScroll = (e: { velocity: number; progress: number }) => {
      scrollVelocityRef.current = e.velocity * 0.01;
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  // Card hover → light pulse burst
  const handleCardHover = useCallback(() => {
    lightPulseRef.current = 1.0;
    setPulseKey((k) => k + 1); // Forces re-evaluation if needed
  }, []);

  const handleCardLeave = useCallback(() => {
    // Pulse decays naturally in the rAF loop
  }, []);

  // ─── GSAP ScrollTrigger setup ───
  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Pin the section — scroll drives the experience
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Drive shader scroll progress from scroll position
          scrollProgressRef.current = Math.min(self.progress * 1.4, 1.0);
        },
      });

      // Horizontal card track animation
      const horizontalScroll = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 100),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Heading reveal
      if (headingRef.current) {
        const headingEls = headingRef.current.querySelectorAll("[data-reveal]");
        gsap.fromTo(
          headingEls,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Card entrance — each card scales and fades in as it approaches viewport
      const cards = track.querySelectorAll("[data-card-reveal]");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.25, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: "left 85%",
              end: "left 50%",
              scrub: true,
            },
          }
        );
      });

      return () => {
        pinTrigger.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="convergence"
      className="relative min-h-screen scroll-mt-20 overflow-hidden"
    >
      {/* WebGL Shadow Canvas — absolute behind everything */}
      <AbyssalCanvas
        scrollProgressRef={scrollProgressRef}
        scrollVelocityRef={scrollVelocityRef}
        lightPulseRef={lightPulseRef}
      />

      {/* Top rule */}
      <div className="flex justify-center px-6 md:px-10">
        <div className="h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-v-smoke/30 to-transparent" />
      </div>

      {/* Heading */}
      <div ref={headingRef} className="px-6 pb-16 pt-32 md:px-10">
        <div className="mx-auto max-w-[90rem]">
          <span
            data-reveal
            className="mb-5 block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.5em] text-v-accent/70"
            style={{ opacity: 0 }}
          >
            004 — The Convergence
          </span>
          <div className="flex items-center gap-6 md:gap-10">
            <div
              data-reveal
              className="hidden h-px w-16 bg-gradient-to-r from-v-accent/40 to-transparent md:block"
              style={{ opacity: 0 }}
            />
            <h2
              data-reveal
              className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-v-chalk"
              style={{ opacity: 0 }}
            >
              Where light meets{" "}
              <span className="italic text-v-accent">shadow</span>
            </h2>
          </div>
          <p
            data-reveal
            className="mt-5 max-w-lg font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.9] tracking-[0.02em] text-v-silver/70 md:text-xs"
            style={{ opacity: 0 }}
          >
            Scroll to witness the convergence. Four pillars define the
            Volari ethos — hover each to push back the darkness.
          </p>
        </div>
      </div>

      {/* Horizontal card track */}
      <div
        ref={trackRef}
        className="flex items-stretch gap-6 px-6 pb-32 will-change-transform md:gap-8 md:px-10"
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

        {/* End spacer */}
        <div className="w-[15vw] shrink-0" aria-hidden="true" />
      </div>

      {/* Bottom progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div
          className="h-full origin-left bg-gradient-to-r from-v-accent/40 via-v-silver/20 to-transparent"
          style={{
            transform: "scaleX(0)",
          }}
          data-convergence-progress
        />
      </div>
    </section>
  );
}
