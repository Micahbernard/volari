"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesShowcase from "@/components/ServicesShowcase";
import WorkShowcase from "@/components/WorkShowcase";
import PageTransition from "@/components/PageTransition";

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
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
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
      // Beat 6  (2.2s) : Scroll indicator appears
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

      // ── Beat 6: Scroll indicator ──
      if (scrollIndicatorRef.current) {
        master.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: "power2.out" },
          2.4
        );

        // Infinite gentle bounce
        gsap.to(scrollIndicatorRef.current, {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: "sine.inOut",
          delay: 3.5,
        });
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
            yPercent: -15,
            opacity: 0.2,
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

          {/* ── Side metadata: left ── */}
          <div
            ref={metaLeftRef}
            className="absolute top-1/2 left-6 hidden -translate-y-1/2 -rotate-90 md:left-10 lg:block opacity-0"
          >
            <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-smoke">
              Est. 2024
            </span>
          </div>

          {/* ── Side metadata: right ── */}
          <div
            ref={metaRightRef}
            className="absolute top-1/2 right-6 hidden -translate-y-1/2 rotate-90 md:right-10 lg:block opacity-0"
          >
            <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-smoke">
              Creative Studio
            </span>
          </div>

          {/* ══════════════════════════════════════════
              MAIN TITLE — Per-character animation
              Each char in its own overflow-hidden clip
              ══════════════════════════════════════════ */}
          <div className="flex flex-col items-center py-16 md:py-24">
            <h1
              className="flex select-none items-baseline justify-center"
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
                    className="inline-block font-[family-name:var(--font-playfair)] text-[clamp(4rem,17vw,15rem)] font-normal tracking-[-0.04em] text-v-chalk opacity-0"
                    style={{
                      willChange: "transform, opacity",
                      transformStyle: "preserve-3d",
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

        {/* ── Scroll indicator ── */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0"
        >
          <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-smoke">
            Scroll
          </span>
          <div className="h-14 w-px bg-gradient-to-b from-v-smoke/60 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES — Horizontal scroll showcase
          ═══════════════════════════════════════════════════════ */}
      <ServicesShowcase />

      {/* ═══════════════════════════════════════════════════════
          WORK — Horizontal portfolio with SVG distortion hover
          ═══════════════════════════════════════════════════════ */}
      <WorkShowcase />

      {/* ═══════════════════════════════════════════════════════
          CONTENT SECTIONS
          ═══════════════════════════════════════════════════════ */}
      <section ref={setSectionRef(0)} className="relative px-6 py-40">
        <div className="mx-auto max-w-4xl">
          <div data-animate="rule" className="v-rule mb-12" />
          <span
            data-animate="heading"
            className="mb-4 block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.4em] text-v-silver opacity-0"
          >
            001 &mdash; Philosophy
          </span>
          <h2
            data-animate="heading"
            className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.02em] text-v-chalk opacity-0"
          >
            Where shadow meets
            <br />
            <span className="italic text-v-accent">precision</span>
          </h2>
          <p
            data-animate="body"
            className="mt-8 max-w-xl font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed text-v-silver opacity-0"
          >
            Every pixel is deliberate. Every interaction, choreographed. We
            don&apos;t build websites — we architect immersive digital
            environments that command attention and convert curiosity into
            commitment.
          </p>
        </div>
      </section>

      <section ref={setSectionRef(1)} className="relative px-6 py-40">
        <div className="mx-auto max-w-4xl">
          <div data-animate="rule" className="v-rule mb-12" />
          <span
            data-animate="heading"
            className="mb-4 block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.4em] text-v-silver opacity-0"
          >
            002 &mdash; Capability
          </span>
          <h2
            data-animate="heading"
            className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.02em] text-v-chalk opacity-0"
          >
            Engineering at the
            <br />
            <span className="italic text-v-accent">bleeding edge</span>
          </h2>
          <p
            data-animate="body"
            className="mt-8 max-w-xl font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed text-v-silver opacity-0"
          >
            WebGL shaders. GPU-accelerated animations. Sub-frame scroll
            synchronization. We leverage the full depth of the modern browser to
            deliver experiences that feel impossible — and perform flawlessly.
          </p>
        </div>
      </section>

      <section ref={setSectionRef(2)} className="relative px-6 py-40">
        <div className="mx-auto max-w-4xl">
          <div data-animate="rule" className="v-rule mb-12" />
          <span
            data-animate="heading"
            className="mb-4 block font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.4em] text-v-silver opacity-0"
          >
            003 &mdash; Contact
          </span>
          <h2
            data-animate="heading"
            className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,5vw,4.5rem)] leading-[1.1] tracking-[-0.02em] text-v-chalk opacity-0"
          >
            Ready to
            <br />
            <span className="italic text-v-accent">transcend?</span>
          </h2>
          <p
            data-animate="body"
            className="mt-8 max-w-xl font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed text-v-silver opacity-0"
          >
            The line between ordinary and extraordinary is thinner than you
            think. Let&apos;s cross it together.
          </p>
        </div>
      </section>

      <div className="h-[30vh]" />
    </PageTransition>
  );
}
