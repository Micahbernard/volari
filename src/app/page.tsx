"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesShowcase from "@/components/ServicesShowcase";
import PageTransition from "@/components/PageTransition";
import StudioPillars from "@/components/StudioPillars";
import SiteFooter from "@/components/SiteFooter";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// VOLARI — Hero character config
// Each letter can carry individual timing/style overrides.
// ─────────────────────────────────────────────────────────────
const HERO_WORD = "VOLARI";

// Custom easing: slow heavy start, explosive release, gentle settle.
// Approximates a spring with high tension and low friction.
const CHAR_EASE = "expo.out";
const CHAR_DURATION = 1.6;
const CHAR_STAGGER = 0.07;

export default function Home() {
  // ── Refs — all animation targets. Zero useState. ──
  const heroRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const taglineWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rulesRef = useRef<{
    top: HTMLDivElement | null;
    bottom: HTMLDivElement | null;
  }>({ top: null, bottom: null });
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaLeftRef = useRef<HTMLDivElement>(null);
  const metaRightRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Split tagline into words for staggered reveal
  const taglineWords = useMemo(
    () => "Digital Experiences Studio — Bespoke Creative Technology".split(" "),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ════════════════════════════════════════════════════════
      // MASTER TIMELINE — The Hero Sequence
      //
      // Beat 0  (0.0s) : Black overlay covers viewport
      // Beat 1  (0.2s) : Overlay lifts — curtain rise
      // Beat 2  (0.4s) : Horizontal rules wipe from center
      // Beat 3  (0.6s) : "VOLARI" characters rise with rotation
      // Beat 4  (1.4s) : Tagline words stagger in
      // Beat 5  (1.6s) : Corner marks + metadata fade in
      // ════════════════════════════════════════════════════════

      const master = gsap.timeline({
        defaults: { ease: CHAR_EASE },
      });

      // ── Beat 0–1: Curtain lift ──
      // Full black overlay fades up to reveal the scene.
      if (overlayRef.current) {
        master.to(
          overlayRef.current,
          {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
          },
          0.2
        );
      }

      // ── Beat 2: Horizontal rules ──
      // Wipe from center outward — establishes the frame.
      if (rulesRef.current.top) {
        master.fromTo(
          rulesRef.current.top,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            transformOrigin: "center center",
          },
          0.5
        );
      }
      if (rulesRef.current.bottom) {
        master.fromTo(
          rulesRef.current.bottom,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            transformOrigin: "center center",
          },
          0.55
        );
      }

      // ── Beat 3: Character reveal ──
      // Each letter rises from below its clip-mask container
      // with slight rotation. The stagger creates a wave that
      // reads left-to-right like the eye naturally scans.
      const chars = charRefs.current.filter(Boolean);
      if (chars.length) {
        master.fromTo(
          chars,
          {
            yPercent: 120,
            rotateX: -40,
            opacity: 0,
          },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: CHAR_DURATION,
            stagger: {
              each: CHAR_STAGGER,
              from: "start",
            },
            ease: CHAR_EASE,
          },
          0.7
        );
      }

      // ── Beat 4: Tagline words ──
      const words = taglineWordsRef.current.filter(Boolean);
      if (words.length) {
        master.fromTo(
          words,
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.04,
            ease: "power3.out",
          },
          1.5
        );
      }

      // ── Beat 5: Corner marks + side metadata ──
      const corners = cornerRefs.current.filter(Boolean);
      if (corners.length) {
        master.fromTo(
          corners,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.06,
            ease: "back.out(2)",
          },
          1.6
        );
      }

      const metaEls = [metaLeftRef.current, metaRightRef.current].filter(
        Boolean
      );
      if (metaEls.length) {
        master.fromTo(
          metaEls,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
          },
          1.7
        );
      }

      // ── Hero scroll parallax ──
      // Title drifts up and fades as user scrolls past hero.
      // Driven by ScrollTrigger, not React state.
      if (heroRef.current) {
        const heroContent = heroRef.current.querySelector(
          "[data-hero-content]"
        );
        if (heroContent) {
          gsap.to(heroContent, {
            yPercent: -8,
            opacity: 0.45,
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }
      }

      // ── Scroll-triggered section reveals ──
      sectionRefs.current.forEach((section) => {
        if (!section) return;

        const headings = section.querySelectorAll("[data-animate='heading']");
        const body = section.querySelector("[data-animate='body']");
        const rule = section.querySelector("[data-animate='rule']");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none none",
          },
        });

        if (rule) {
          tl.fromTo(
            rule,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 1.2, ease: "expo.out" },
            0
          );
        }

        if (headings.length) {
          tl.fromTo(
            headings,
            { clipPath: "inset(0 100% 0 0)", opacity: 0 },
            {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              duration: 1.4,
              stagger: 0.08,
              ease: "expo.out",
            },
            0.1
          );
        }

        if (body) {
          tl.fromTo(
            body,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            0.3
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // ── Ref setters ──
  const setCharRef = (i: number) => (el: HTMLSpanElement | null) => {
    charRefs.current[i] = el;
  };
  const setTaglineWordRef = (i: number) => (el: HTMLSpanElement | null) => {
    taglineWordsRef.current[i] = el;
  };
  const setCornerRef = (i: number) => (el: HTMLDivElement | null) => {
    cornerRefs.current[i] = el;
  };
  const setSectionRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el;
  };

  return (
    <PageTransition>
      {/* ═══════════════════════════════════════════════════════
          CURTAIN OVERLAY — Solid black, lifts to reveal hero
          ═══════════════════════════════════════════════════════ */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-v-black"
        style={{ willChange: "transform" }}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════
          HERO — Full viewport, cinematic entrance
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      >
        {/* Parallax wrapper — moves as a unit on scroll */}
        <div data-hero-content className="relative w-full">
          {/* ── Decorative corner marks ── */}
          <div className="pointer-events-none absolute inset-6 md:inset-12">
            {/* Top-left */}
            <div
              ref={setCornerRef(0)}
              className="absolute top-0 left-0 h-6 w-6 border-t border-l border-v-smoke/40 opacity-0"
            />
            {/* Top-right */}
            <div
              ref={setCornerRef(1)}
              className="absolute top-0 right-0 h-6 w-6 border-t border-r border-v-smoke/40 opacity-0"
            />
            {/* Bottom-left */}
            <div
              ref={setCornerRef(2)}
              className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-v-smoke/40 opacity-0"
            />
            {/* Bottom-right */}
            <div
              ref={setCornerRef(3)}
              className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-v-smoke/40 opacity-0"
            />
          </div>

          {/* ── Top rule ── */}
          <div className="flex items-center justify-center px-6 md:px-12">
            <div
              ref={(el) => {
                rulesRef.current.top = el;
              }}
              className="h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-v-smoke/40 to-transparent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          {/* ══════════════════════════════════════════
              MAIN TITLE — Per-character animation
              Each char in its own overflow-hidden clip
              ══════════════════════════════════════════ */}
          <div className="flex flex-col items-center py-16 md:py-24">
            <h1
              className="hero-volari-heading flex select-none items-center justify-center text-[clamp(4rem,17vw,15rem)] leading-none gap-x-[0.05em] sm:gap-x-[0.055em] md:gap-x-[0.06em]"
              style={{ perspective: "1000px" }}
            >
              {HERO_WORD.split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden"
                  style={{ lineHeight: 1 }}
                >
                  <span
                    ref={setCharRef(i)}
                    className="hero-volari-letter inline-block font-[family-name:var(--font-playfair)] font-normal tracking-[0.012em] opacity-0"
                    style={{
                      willChange: "transform, opacity",
                      transformStyle: "preserve-3d",
                      animationDelay: `${i * 0.09}s`,
                    }}
                  >
                    {char}
                  </span>
                </span>
              ))}
            </h1>

            {/* ── Tagline — word-by-word stagger ── */}
            <p
              ref={taglineRef}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-[0.45em] gap-y-1 overflow-hidden px-4 md:mt-8"
            >
              {taglineWords.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden">
                  <span
                    ref={setTaglineWordRef(i)}
                    className="inline-block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.35em] text-v-silver opacity-0 md:text-xs"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </p>
          </div>

          {/* ── Studio metadata — horizontal, symmetric (no vertical rotation) ── */}
          <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:items-center md:mt-12 md:px-12">
            <div ref={metaLeftRef} className="opacity-0">
              <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-smoke">
                Est. 2024
              </span>
            </div>
            <div ref={metaRightRef} className="opacity-0">
              <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-smoke">
                Creative Studio
              </span>
            </div>
          </div>

          {/* ── Bottom rule ── */}
          <div className="flex items-center justify-center px-6 md:px-12">
            <div
              ref={(el) => {
                rulesRef.current.bottom = el;
              }}
              className="h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-v-smoke/40 to-transparent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES — Horizontal scroll showcase
          ═══════════════════════════════════════════════════════ */}
      <div id="services"><ServicesShowcase /></div>

      <StudioPillars />

      {/* ═══════════════════════════════════════════════════════
          CONTENT SECTIONS
          ═══════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════
          001 — PHILOSOPHY
          ═══════════════════════════════════════════════════════ */}
      <section
        id="about"
        ref={setSectionRef(0)}
        className="relative px-8 py-32 md:px-16 lg:px-24"
      >
        <div className="mx-auto max-w-7xl">
          {/* Full-width rule above */}
          <div data-animate="rule" className="v-rule mb-16 md:mb-24" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] md:gap-24">
            {/* Left — decorative number + label */}
            <div className="flex flex-col justify-start pt-2">
              <span
                data-animate="heading"
                className="block font-[family-name:var(--font-playfair)] text-[clamp(4rem,8vw,7rem)] font-normal leading-none tracking-[-0.04em] text-v-smoke/30 opacity-0 select-none"
              >
                001
              </span>
              <span
                data-animate="heading"
                className="mt-4 block font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-accent opacity-0"
              >
                Philosophy
              </span>
            </div>

            {/* Right — content */}
            <div>
              <h2
                data-animate="heading"
                className="font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-v-chalk opacity-0"
              >
                Where shadow meets
                <br />
                <span className="italic text-v-accent">precision</span>
              </h2>
              <p
                data-animate="body"
                className="mt-8 max-w-lg font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.9] text-v-silver opacity-0"
              >
                Every pixel is deliberate. Every interaction, choreographed. We
                don&apos;t build websites — we architect immersive digital
                environments that command attention and convert curiosity into
                commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          002 — CAPABILITY
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={setSectionRef(1)}
        className="relative px-8 py-32 md:px-16 lg:px-24"
      >
        <div className="mx-auto max-w-7xl">
          <div data-animate="rule" className="v-rule mb-16 md:mb-24" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] md:gap-24">
            {/* Left */}
            <div className="flex flex-col justify-start pt-2">
              <span
                data-animate="heading"
                className="block font-[family-name:var(--font-playfair)] text-[clamp(4rem,8vw,7rem)] font-normal leading-none tracking-[-0.04em] text-v-smoke/30 opacity-0 select-none"
              >
                002
              </span>
              <span
                data-animate="heading"
                className="mt-4 block font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-accent opacity-0"
              >
                Capability
              </span>
            </div>

            {/* Right */}
            <div>
              <h2
                data-animate="heading"
                className="font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-v-chalk opacity-0"
              >
                Engineering at the
                <br />
                <span className="italic text-v-accent">bleeding edge</span>
              </h2>
              <p
                data-animate="body"
                className="mt-8 max-w-lg font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.9] text-v-silver opacity-0"
              >
                WebGL shaders. GPU-accelerated animations. Sub-frame scroll
                synchronization. We leverage the full depth of the modern browser to
                deliver experiences that feel impossible — and perform flawlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          003 — CONTACT
          ═══════════════════════════════════════════════════════ */}
      <section
        id="contact"
        ref={setSectionRef(2)}
        className="relative px-8 py-32 md:px-16 lg:px-24"
      >
        <div className="mx-auto max-w-7xl">
          <div data-animate="rule" className="v-rule mb-16 md:mb-24" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] md:gap-24">
            {/* Left */}
            <div className="flex flex-col justify-start pt-2">
              <span
                data-animate="heading"
                className="block font-[family-name:var(--font-playfair)] text-[clamp(4rem,8vw,7rem)] font-normal leading-none tracking-[-0.04em] text-v-smoke/30 opacity-0 select-none"
              >
                003
              </span>
              <span
                data-animate="heading"
                className="mt-4 block font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-accent opacity-0"
              >
                Contact
              </span>
            </div>

            {/* Right */}
            <div>
              <h2
                data-animate="heading"
                className="font-[family-name:var(--font-playfair)] text-[clamp(2.8rem,5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-v-chalk opacity-0"
              >
                Ready to
                <br />
                <span className="italic text-v-accent">transcend?</span>
              </h2>
              <p
                data-animate="body"
                className="mt-8 max-w-lg font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.9] text-v-silver opacity-0"
              >
                The line between ordinary and extraordinary is thinner than you
                think. Let&apos;s cross it together.
              </p>
              <div data-animate="body" className="mt-12 opacity-0">
                <a
                  href="mailto:hello@volari.studio"
                  data-cursor-magnetic
                  data-cursor-label="Connect"
                  className="group inline-flex items-center gap-4 border border-v-smoke/50 px-8 py-4 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.4em] text-v-chalk transition-all duration-500 hover:border-v-accent/60 hover:text-v-accent"
                >
                  Start a project
                  <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </PageTransition>
  );
}
