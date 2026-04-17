"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    title: "Direction",
    body: "Positioning, narrative, and creative north star — so every decision aligns before a single frame ships.",
    href: "#about",
    cta: "Philosophy",
  },
  {
    title: "Craft",
    body: "Systems, motion, and typography in lockstep — bespoke surfaces that feel inevitable, not decorative.",
    href: "#services",
    cta: "Capabilities",
  },
  {
    title: "Delivery",
    body: "Performance-budgeted builds, disciplined handoff, and launch with confidence — shipped, measured, refined.",
    href: "#contact",
    cta: "Start a project",
  },
] as const;

function PillarVisual({ index }: { index: number }) {
  const noise =
    "absolute inset-0 opacity-[0.18] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2748%27 height=%2748%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.2%27/%3E%3C/svg%3E')]";

  if (index === 0) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-v-accent/20 via-v-smoke/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_30%_20%,rgba(212,175,55,0.14),transparent_52%)]" />
        <div className={noise} />
      </>
    );
  }
  if (index === 1) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-tl from-v-smoke/25 via-transparent to-v-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_60%,rgba(148,163,184,0.12),transparent_55%)]" />
        <div className={noise} />
      </>
    );
  }
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-v-smoke/15 to-v-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(255,255,255,0.06),transparent_48%)]" />
      <div className={noise} />
    </>
  );
}

export default function StudioPillars() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const rule = section.querySelector("[data-pillar-rule]");
      const intro = section.querySelector("[data-pillar-intro]");
      const cards = section.querySelectorAll("[data-pillar-card]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "top 35%",
          toggleActions: "play none none none",
        },
      });

      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.1, ease: "expo.out" },
          0
        );
      }

      if (intro) {
        tl.fromTo(
          intro,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          0.12
        );
      }

      if (cards.length) {
        tl.fromTo(
          cards,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.25
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative border-t border-v-smoke/15 bg-v-black/20 px-8 py-32 sm:px-12 md:px-20 lg:px-28 xl:px-40 2xl:px-52"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          data-pillar-rule
          className="v-rule mb-14 md:mb-20"
          style={{ transform: "scaleX(0)" }}
        />

        <div
          data-pillar-intro
          className="mb-20 grid grid-cols-1 gap-10 text-left opacity-0 md:mb-24 md:grid-cols-2 md:items-start md:gap-12 lg:gap-14"
        >
          <div className="min-w-0 text-left">
            <p className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.5em] text-v-accent">
              How we work
            </p>
            <h2 className="mt-5 font-[family-name:var(--font-playfair)] text-[clamp(2rem,4.2vw,3rem)] leading-[1.1] tracking-[-0.02em] text-v-chalk">
              Direction, craft,
              <br className="hidden sm:inline" /> and delivery.
            </h2>
            <p className="mt-6 max-w-lg font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.95] text-v-silver">
              Three beats — one continuous line from intent to launch. Each
              phase is discrete; together they are the Volari method.
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-sm border border-v-smoke/20 bg-v-black/40 md:max-w-none md:justify-self-stretch">
            <div className="absolute inset-0">
              <PillarVisual index={0} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-v-black/50 via-transparent to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:items-start sm:gap-6 md:gap-10">
          {PILLARS.map((pillar, index) => (
            <article
              key={pillar.title}
              data-pillar-card
              className="group relative flex flex-col opacity-0"
            >
              <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.45em] text-v-accent/70">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-sm border border-v-smoke/20 bg-v-black/40 transition-all duration-700 group-hover:border-v-accent/35">
                <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                  <PillarVisual index={index} />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-v-black/80 via-v-black/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                  <span className="font-[family-name:var(--font-geist-mono)] text-[8px] uppercase tracking-[0.4em] text-v-chalk/70">
                    {pillar.title}
                  </span>
                  <span className="h-px w-8 bg-v-accent/60 transition-all duration-500 group-hover:w-14 group-hover:bg-v-accent" />
                </div>
              </div>

              <h3 className="mt-6 font-[family-name:var(--font-playfair)] text-[1.4rem] tracking-[-0.02em] text-v-chalk md:text-[1.5rem]">
                {pillar.title}
              </h3>
              <p className="mt-3 flex-1 font-[family-name:var(--font-geist-mono)] text-[11px] leading-[1.9] text-v-silver">
                {pillar.body}
              </p>
              <a
                href={pillar.href}
                className="mt-6 inline-flex w-fit items-center gap-3 font-[family-name:var(--font-geist-mono)] text-[9px] uppercase tracking-[0.4em] text-v-accent transition-all duration-500 hover:text-v-chalk"
                data-cursor-magnetic
                data-cursor-label="Open"
              >
                {pillar.cta}
                <span
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
