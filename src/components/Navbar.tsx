"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// Navbar
//
// Fixed header. Transparent over hero, glass-blur on scroll.
// Hides on scroll-down, reveals on scroll-up.
// All driven by ScrollTrigger → GSAP. Zero React state.
//
// Nav links have data-cursor-magnetic + data-cursor-label
// so the custom cursor pulls toward them and shows labels.
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Work", href: "#work", cursorLabel: "View" },
  { label: "About", href: "#about", cursorLabel: "Read" },
  { label: "Services", href: "#services", cursorLabel: "Explore" },
  { label: "Contact", href: "#contact", cursorLabel: "Connect" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ctx = gsap.context(() => {
      // ── Entrance animation ──
      const entranceTl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 2.0, // After hero characters land (~0.7 + 6×0.07 + 1.6)
      });

      // Logo mask reveal
      if (logoRef.current) {
        entranceTl.fromTo(
          logoRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1 },
          0
        );
      }

      // Stagger nav links from right
      const validLinks = linksRef.current.filter(Boolean);
      if (validLinks.length) {
        entranceTl.fromTo(
          validLinks,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.2
        );
      }

      // Bottom rule wipe
      if (ruleRef.current) {
        entranceTl.fromTo(
          ruleRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.2, ease: "expo.out" },
          0.1
        );
      }

      // ── Scroll behavior: hide on down, show on up ──
      // Uses ScrollTrigger's onUpdate for direction detection.
      // Mutates transform directly — no React state involved.
      let lastDirection = -1;

      ScrollTrigger.create({
        start: "top -80",
        end: "max",
        onUpdate: (self) => {
          const direction = self.direction; // 1 = down, -1 = up

          if (direction !== lastDirection) {
            lastDirection = direction;

            if (direction === 1) {
              // Scrolling down — hide nav
              gsap.to(nav, {
                y: "-100%",
                duration: 0.5,
                ease: "power3.inOut",
              });
            } else {
              // Scrolling up — show nav with backdrop
              gsap.to(nav, {
                y: "0%",
                duration: 0.4,
                ease: "power3.out",
              });
            }
          }
        },
      });

      // ── Backdrop blur activation after scrolling past hero ──
      ScrollTrigger.create({
        start: "top -100",
        onEnter: () => nav.classList.add("nav-scrolled"),
        onLeaveBack: () => nav.classList.remove("nav-scrolled"),
      });
    });

    return () => ctx.revert();
  }, []);

  const setLinkRef = (i: number) => (el: HTMLAnchorElement | null) => {
    linksRef.current[i] = el;
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-[backdrop-filter,background-color] duration-500"
      style={{ willChange: "transform" }}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-[90rem] items-center justify-between px-6 md:px-10">
        {/* ── Logo ── */}
        <a
          ref={logoRef}
          href="/"
          data-cursor-magnetic
          data-cursor-label="Home"
          className="relative block opacity-0"
        >
          <span className="font-[family-name:var(--font-playfair)] text-xl tracking-[-0.02em] text-v-chalk">
            Volari
          </span>
          <span className="absolute -bottom-1 left-0 font-[family-name:var(--font-geist-mono)] text-[7px] uppercase tracking-[0.5em] text-v-silver">
            Studio
          </span>
        </a>

        {/* ── Nav links ── */}
        <div className="flex items-center gap-10">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              ref={setLinkRef(i)}
              href={link.href}
              data-cursor-magnetic
              data-cursor-label={link.cursorLabel}
              className="group relative block py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.25em] text-v-silver opacity-0 transition-colors duration-300 hover:text-v-chalk"
            >
              {link.label}
              {/* Underline reveal on hover */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-v-accent transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-full" />
            </a>
          ))}

          {/* ── CTA dot separator + inquiry link ── */}
          <span className="h-1 w-1 rounded-full bg-v-smoke" aria-hidden="true" />
          <a
            ref={setLinkRef(NAV_LINKS.length)}
            href="#contact"
            data-cursor-magnetic
            data-cursor-label="Let's Talk"
            className="relative block overflow-hidden py-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.25em] text-v-accent opacity-0 transition-colors duration-300 hover:text-v-chalk"
          >
            Inquire
            <span className="absolute bottom-0 left-0 h-px w-full bg-v-accent-dim transition-all duration-500" />
          </a>
        </div>
      </div>

      {/* ── Bottom rule ── */}
      <div
        ref={ruleRef}
        className="h-px w-full bg-gradient-to-r from-transparent via-v-smoke/50 to-transparent"
        style={{ transform: "scaleX(0)" }}
      />
    </nav>
  );
}
