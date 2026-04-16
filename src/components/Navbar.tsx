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
  const menuOpenRef = useRef(menuOpen);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
  }, [lenis, menuOpen]);

  const dotRef = useRef<HTMLSpanElement>(null);

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
            className="relative inline-flex min-w-0 shrink-0 flex-col items-stretch justify-center gap-1.5 opacity-0"
          >
            <span className="block text-center font-[family-name:var(--font-playfair)] text-[1.75rem] leading-none tracking-[-0.035em] text-v-chalk sm:text-[2rem] md:text-[2.125rem]">
              Volari
            </span>
            <span className="block w-full border-t border-v-smoke/35 pt-1.5 text-center font-[family-name:var(--font-geist-mono)] text-[9px] uppercase leading-none tracking-[0.42em] text-v-silver/80 sm:text-[10px] sm:tracking-[0.48em]">
              Studio
            </span>
          </Link>

          {/* Magnetic cursor would drift the visual center from the button; keep off this control. */}
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={openMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            data-cursor-label="Menu"
            className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full opacity-0 outline-none focus-visible:ring-2 focus-visible:ring-v-accent/50"
          >
            {/* Scale ring+dot only — keeps ref’d button free of hover transform vs GSAP y */}
            <span
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]"
              aria-hidden
            >
              <span
                className="absolute inset-0 rounded-full border border-v-smoke/45 transition-[border-color,box-shadow] duration-300 group-hover:border-v-chalk/35 group-hover:shadow-[0_0_24px_rgba(232,232,232,0.12)]"
                aria-hidden
              />
              <span
                ref={dotRef}
                className="relative h-2 w-2 rounded-full bg-v-chalk shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover:scale-110"
              />
            </span>
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
