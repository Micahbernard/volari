"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/providers/SmoothScrollProvider";
import NavMenuOverlay from "@/components/NavMenuOverlay";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// Navbar — Logo + orbit menu trigger (dot + ring).
// Click: full-screen NavMenuOverlay (z-55). Lenis paused while open.
// ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const menuOpenRef = useRef(menuOpen);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
  }, [lenis, menuOpen]);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 2.0,
      });

      if (logoRef.current) {
        entranceTl.fromTo(
          logoRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1 },
          0
        );
      }

      if (menuTriggerRef.current) {
        entranceTl.fromTo(
          menuTriggerRef.current,
          { y: -18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
          0.2
        );
      }

      if (ruleRef.current) {
        entranceTl.fromTo(
          ruleRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.2, ease: "expo.out" },
          0.1
        );
      }

      let lastDirection = -1;

      ScrollTrigger.create({
        start: "top -80",
        end: "max",
        onUpdate: (self) => {
          const direction = self.direction;
          if (menuOpenRef.current) return;

          if (direction !== lastDirection) {
            lastDirection = direction;

            if (direction === 1) {
              gsap.to(nav, {
                y: "-100%",
                duration: 0.5,
                ease: "power3.inOut",
              });
            } else {
              gsap.to(nav, {
                y: "0%",
                duration: 0.4,
                ease: "power3.out",
              });
            }
          }
        },
      });

      ScrollTrigger.create({
        start: "top -100",
        onEnter: () => nav.classList.add("nav-scrolled"),
        onLeaveBack: () => nav.classList.remove("nav-scrolled"),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="nav-viewport-inset fixed top-0 right-0 left-0 z-50 box-border transition-[backdrop-filter,background-color] duration-500"
        style={{ willChange: "transform" }}
      >
        <div className="mx-auto flex h-[var(--header-height)] w-full max-w-[90rem] items-center justify-between">
          <Link
            ref={logoRef}
            href="/"
            data-cursor-magnetic
            data-cursor-label="Home"
            className="group/logo relative inline-flex min-w-0 shrink-0 items-center gap-3 opacity-0 sm:gap-3.5"
          >
            {/* Engraved monogram crest — hex frame + serif V that ink-fills gold on hover */}
            <span
              aria-hidden
              className="relative block h-9 w-9 shrink-0 sm:h-10 sm:w-10"
            >
              {/* Hex frame — hairline, brightens to gold on hover */}
              <svg
                viewBox="0 0 40 40"
                className="absolute inset-0 h-full w-full overflow-visible"
                fill="none"
              >
                <polygon
                  points="20,2 36,11 36,29 20,38 4,29 4,11"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-v-smoke/45 transition-[color,filter] duration-500 group-hover/logo:text-v-accent group-hover/logo:[filter:drop-shadow(0_0_6px_rgba(212,168,83,0.35))]"
                />
                {/* Inner decorative hex — thinner, emerges on hover */}
                <polygon
                  points="20,7 31,13.5 31,26.5 20,33 9,26.5 9,13.5"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-v-smoke/0 transition-[color] duration-500 group-hover/logo:text-v-accent/40"
                />
              </svg>
              {/* Serif V — silver base; gold overlay ink-fills upward on hover via clip-path */}
              <span className="absolute inset-0 flex items-center justify-center pb-[1px] font-[family-name:var(--font-playfair)] text-[1.35rem] leading-none tracking-[-0.02em] text-v-silver/85 sm:text-[1.5rem]">
                V
              </span>
              <span
                className="absolute inset-0 flex items-center justify-center pb-[1px] font-[family-name:var(--font-playfair)] text-[1.35rem] leading-none tracking-[-0.02em] text-v-accent transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:inset(100%_0_0_0)] group-hover/logo:[clip-path:inset(0%_0_0_0)] sm:text-[1.5rem]"
                style={{
                  textShadow: "0 0 8px rgba(212,168,83,0.35)",
                }}
              >
                V
              </span>
            </span>

            {/* Wordmark — hierarchy:
                L1 Volari (serif chalk), L2 Studio row (mono eyebrow).
                Left edges align via items-start; leading hairline replaces
                full underline so L2 reads as support, not equal weight. */}
            <span className="flex min-w-0 flex-col items-start gap-[0.4rem]">
              <span className="-ml-[2px] block font-[family-name:var(--font-playfair)] text-[1.75rem] leading-[0.95] tracking-[-0.035em] text-v-chalk sm:text-[2rem] md:text-[2.125rem]">
                Volari
              </span>
              <span className="flex items-center gap-2.5">
                <span className="font-[family-name:var(--font-geist-mono)] text-[9px] uppercase leading-none tracking-[0.42em] text-v-silver/85 transition-[color] duration-500 group-hover/logo:text-v-chalk sm:text-[10px] sm:tracking-[0.48em]">
                  Studio
                </span>
                <span
                  aria-hidden
                  className="h-[3px] w-[3px] rounded-full bg-v-smoke/50 transition-[background-color] duration-500 group-hover/logo:bg-v-accent"
                />
                <span className="font-[family-name:var(--font-geist-mono)] text-[8px] uppercase leading-none tracking-[0.35em] text-v-silver/55 transition-[color] duration-500 group-hover/logo:text-v-silver/90 sm:text-[9px]">
                  N°01
                </span>
              </span>
            </span>
          </Link>

          {/* Decanter — ring glass vessel; hover pours warm gold liquid
              with animated meniscus (two offset sine layers), rising bubbles,
              and inverts the center dot when submerged. */}
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={openMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            data-cursor-label="Menu"
            className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-v-smoke/45 opacity-0 outline-none transition-[border-color,box-shadow] duration-500 focus-visible:ring-2 focus-visible:ring-v-accent/50 group-hover:border-v-accent/60 hover:border-v-accent/60 hover:shadow-[0_0_24px_rgba(212,168,83,0.18)]"
          >
            {/* Liquid chamber — clipped to circle, liquid rises from bottom on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              {/* Liquid body — translates up on hover to half-fill vessel */}
              <span className="absolute inset-0 translate-y-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1/2">
                {/* Gold body with vertical depth gradient */}
                <span className="absolute inset-0 bg-gradient-to-b from-v-accent/85 via-v-accent to-[#b88f3f]" />

                {/* Meniscus — primary wave layer */}
                <svg
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                  className="absolute -top-[9px] left-0 h-5 w-[200%] animate-[decanter-wave-shift_3s_linear_infinite] text-v-accent"
                >
                  <path
                    d="M0,10 C25,2 50,18 75,10 C100,2 125,18 150,10 C175,2 200,18 200,10 L200,20 L0,20 Z"
                    fill="currentColor"
                  />
                </svg>
                {/* Meniscus — secondary offset wave (lighter, slower) */}
                <svg
                  viewBox="0 0 200 20"
                  preserveAspectRatio="none"
                  className="absolute -top-[7px] left-0 h-5 w-[200%] animate-[decanter-wave-shift-alt_4.5s_linear_infinite] text-v-accent opacity-60"
                >
                  <path
                    d="M0,10 C30,16 60,4 100,10 C140,16 170,4 200,10 L200,20 L0,20 Z"
                    fill="currentColor"
                  />
                </svg>

                {/* Surface highlight — refraction skim */}
                <span className="absolute top-[1px] right-3 left-3 h-px bg-v-chalk/50" />

                {/* Rising bubbles */}
                <span className="absolute bottom-1 left-[12px] h-[2px] w-[2px] rounded-full bg-v-chalk/80 opacity-0 group-hover:animate-[decanter-bubble_2.2s_ease-in-out_infinite]" />
                <span className="absolute right-[14px] bottom-0 h-[2px] w-[2px] rounded-full bg-v-chalk/65 opacity-0 [animation-delay:0.8s] group-hover:animate-[decanter-bubble_2.6s_ease-in-out_infinite]" />
                <span className="absolute bottom-2 left-1/2 h-[1.5px] w-[1.5px] rounded-full bg-v-chalk/60 opacity-0 [animation-delay:1.4s] group-hover:animate-[decanter-bubble_2.4s_ease-in-out_infinite]" />
              </span>
            </span>

            {/* Center dot — rests on the meniscus (half submerged at fill level) */}
            <span
              ref={dotRef}
              aria-hidden
              className="relative h-2 w-2 rounded-full bg-v-chalk shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-[box-shadow] duration-500 group-hover:shadow-[0_0_14px_rgba(232,232,232,0.55)]"
            />
            <span className="sr-only">Open menu</span>
          </button>
        </div>

        <div
          ref={ruleRef}
          className="h-px w-full bg-gradient-to-r from-transparent via-v-smoke/50 to-transparent"
          style={{ transform: "scaleX(0)" }}
        />
      </nav>

      {menuOpen ? (
        <NavMenuOverlay onClose={() => setMenuOpen(false)} />
      ) : null}
    </>
  );
}
