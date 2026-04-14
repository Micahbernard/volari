"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// Service data — each card in the horizontal rail
// ─────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "01",
    title: "Web Design\n& Development",
    description:
      "Bespoke sites engineered for conversion. We fuse editorial design with sub-frame performance to create digital storefronts that command premium pricing.",
    tags: ["Next.js", "WebGL", "Headless CMS", "E-Commerce"],
    accent: "from-v-smoke/20 via-v-charcoal to-v-black",
  },
  {
    id: "02",
    title: "AI-Powered\nSEO Strategy",
    description:
      "Machine-learning audits, programmatic content architecture, and technical SEO that compounds. We don't chase algorithms — we anticipate them.",
    tags: ["Technical SEO", "AI Content", "Schema", "Analytics"],
    accent: "from-v-charcoal/30 via-v-void to-v-black",
  },
  {
    id: "03",
    title: "Brand\nIdentity",
    description:
      "Visual systems that scale from favicon to billboard. Typography, color theory, and motion language distilled into a cohesive identity that resonates.",
    tags: ["Visual Identity", "Typography", "Motion Design", "Guidelines"],
    accent: "from-v-smoke/15 via-v-ash to-v-black",
  },
  {
    id: "04",
    title: "Creative\nTechnology",
    description:
      "Interactive installations, generative art, and immersive experiences that blur the boundary between digital craft and fine art.",
    tags: ["Three.js", "GLSL Shaders", "Generative Art", "R3F"],
    accent: "from-v-charcoal/25 via-v-void to-v-black",
  },
  {
    id: "05",
    title: "Digital\nStrategy",
    description:
      "Data-informed roadmaps that align business goals with user behavior. Conversion architecture, funnel design, and growth systems.",
    tags: ["CRO", "Analytics", "UX Research", "Growth"],
    accent: "from-v-smoke/10 via-v-charcoal to-v-black",
  },
];

// ─────────────────────────────────────────────────────────────
// ServicesShowcase
//
// Vertical scroll → horizontal movement via ScrollTrigger pin.
// Cards have CSS-based distortion hover (skew + RGB split + scale).
// All animation via refs. Zero React state.
//
// Architecture:
//   Outer div: tall enough for scroll distance (cards × 100vw)
//   Inner div: pinned, translateX driven by scrub
//   Cards: ~70vw wide, stacked horizontally in a flex row
// ─────────────────────────────────────────────────────────────
export default function ServicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  // ── Card hover distortion — GSAP-driven, not CSS transitions ──
  const onCardEnter = useCallback((e: MouseEvent) => {
    const card = (e.currentTarget as HTMLElement).querySelector(
      "[data-card-visual]"
    );
    const overlay = (e.currentTarget as HTMLElement).querySelector(
      "[data-card-overlay]"
    );
    if (!card) return;

    gsap.to(card, {
      scale: 1.03,
      skewY: -1.5,
      duration: 0.6,
      ease: "power3.out",
    });

    // RGB split — offset pseudo layers
    const redLayer = (e.currentTarget as HTMLElement).querySelector(
      "[data-rgb='red']"
    );
    const blueLayer = (e.currentTarget as HTMLElement).querySelector(
      "[data-rgb='blue']"
    );
    if (redLayer) {
      gsap.to(redLayer, {
        x: 4,
        y: -2,
        opacity: 0.6,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (blueLayer) {
      gsap.to(blueLayer, {
        x: -4,
        y: 2,
        opacity: 0.6,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (overlay) {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  const onCardLeave = useCallback((e: MouseEvent) => {
    const card = (e.currentTarget as HTMLElement).querySelector(
      "[data-card-visual]"
    );
    const overlay = (e.currentTarget as HTMLElement).querySelector(
      "[data-card-overlay]"
    );
    if (!card) return;

    gsap.to(card, {
      scale: 1,
      skewY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });

    const redLayer = (e.currentTarget as HTMLElement).querySelector(
      "[data-rgb='red']"
    );
    const blueLayer = (e.currentTarget as HTMLElement).querySelector(
      "[data-rgb='blue']"
    );
    if (redLayer) {
      gsap.to(redLayer, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (blueLayer) {
      gsap.to(blueLayer, {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // ── Section heading entrance ──
      if (headingRef.current) {
        const headingEls =
          headingRef.current.querySelectorAll("[data-animate]");
        gsap.fromTo(
          headingEls,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // ── Horizontal scroll ──
      // Calculate total horizontal travel distance.
      // Track width minus one viewport = total scroll distance.
      const getScrollDistance = () => {
        return -(track.scrollWidth - window.innerWidth);
      };

      const horizontalScroll = gsap.to(track, {
        x: getScrollDistance,
        ease: "none", // Linear — scroll position maps 1:1 to track position
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.8, // Slight smoothing for buttery feel
          invalidateOnRefresh: true, // Recalculate on resize
          anticipatePin: 1,
        },
      });

      // ── Progress bar ──
      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 0.3,
          },
        });
      }

      // ── Individual card parallax within the scroll ──
      // Cards closer to viewport center scale up slightly.
      cardRefs.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0.4, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: "left 80%",
              end: "left 40%",
              scrub: true,
            },
          }
        );

        // Fade out as card exits left
        gsap.to(card, {
          opacity: 0.4,
          scale: 0.92,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalScroll,
            start: "right 40%",
            end: "right 10%",
            scrub: true,
          },
        });
      });

      // ── Card hover listeners ──
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.addEventListener("mouseenter", onCardEnter as EventListener);
        card.addEventListener("mouseleave", onCardLeave as EventListener);
      });
    }, section);

    return () => {
      ctx.revert();
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.removeEventListener("mouseenter", onCardEnter as EventListener);
        card.removeEventListener("mouseleave", onCardLeave as EventListener);
      });
    };
  }, [onCardEnter, onCardLeave]);

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el;
  };

  return (
    <section ref={sectionRef} className="relative" id="services">
      {/* ── Section heading — above pinned area ── */}
      <div ref={headingRef} className="px-6 pb-16 pt-32 md:px-10">
        <div className="mx-auto max-w-[90rem]">
          <span
            data-animate
            className="mb-4 block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.4em] text-v-silver opacity-0"
          >
            004 &mdash; Services
          </span>
          <h2
            data-animate
            className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.02em] text-v-chalk opacity-0"
          >
            What we <span className="italic text-v-accent">architect</span>
          </h2>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 h-px overflow-hidden">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-gradient-to-r from-v-smoke via-v-silver/30 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* ── Horizontal track — pinned, translated by ScrollTrigger ── */}
      <div
        ref={trackRef}
        className="flex items-stretch gap-8 px-6 pb-20 will-change-transform md:gap-12 md:px-10"
      >
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            ref={setCardRef(i)}
            data-cursor-label="Explore"
            className="group relative flex w-[85vw] shrink-0 flex-col md:w-[65vw] lg:w-[55vw]"
          >
            {/* ── Card visual area — distortion target ── */}
            <div className="relative overflow-hidden rounded-sm">
              <div
                data-card-visual
                className={`relative aspect-[16/10] w-full bg-gradient-to-br ${service.accent}`}
                style={{ willChange: "transform" }}
              >
                {/* Abstract visual — gradient + noise texture via CSS */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(42,42,42,0.3),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(26,26,26,0.4),transparent_60%)]" />

                {/* Large service number watermark */}
                <span className="absolute bottom-4 right-6 font-[family-name:var(--font-playfair)] text-[clamp(5rem,12vw,10rem)] leading-none text-white/[0.03] md:bottom-6 md:right-10">
                  {service.id}
                </span>

                {/* ── RGB split layers (for hover distortion) ── */}
                <div
                  data-rgb="red"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_40%,rgba(120,30,30,0.15),transparent_60%)] opacity-0 mix-blend-screen"
                  style={{ willChange: "transform, opacity" }}
                />
                <div
                  data-rgb="blue"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_60%,rgba(30,30,120,0.15),transparent_60%)] opacity-0 mix-blend-screen"
                  style={{ willChange: "transform, opacity" }}
                />

                {/* ── Hover overlay — "View Service" prompt ── */}
                <div
                  data-card-overlay
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-v-black/30 opacity-0 backdrop-blur-[2px]"
                >
                  <span className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-xs uppercase tracking-[0.3em] text-v-chalk">
                    Explore
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1} />
                  </span>
                </div>
              </div>
            </div>

            {/* ── Card metadata ── */}
            <div className="mt-6 flex flex-1 flex-col md:mt-8">
              {/* Number + rule */}
              <div className="mb-4 flex items-center gap-4">
                <span className="font-[family-name:var(--font-geist-mono)] text-[10px] tracking-[0.3em] text-v-smoke">
                  {service.id}
                </span>
                <div className="h-px flex-1 bg-v-smoke/30" />
              </div>

              {/* Title — pre-formatted with \n for line breaks */}
              <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.5rem,3.5vw,2.8rem)] leading-[1.1] tracking-[-0.02em] text-v-chalk">
                {service.title.split("\n").map((line, li) => (
                  <span key={li}>
                    {li > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h3>

              {/* Description */}
              <p className="mt-4 max-w-md font-[family-name:var(--font-geist-mono)] text-[11px] leading-relaxed text-v-silver md:text-xs">
                {service.description}
              </p>

              {/* Tags */}
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-v-smoke/30 px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.2em] text-v-smoke transition-colors duration-300 group-hover:border-v-silver/30 group-hover:text-v-silver"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* ── End spacer — ensures last card can center ── */}
        <div className="w-[20vw] shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
