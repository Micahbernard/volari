"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";

// ─────────────────────────────────────────────────────────────
// CustomCursor
//
// Architecture: 3 layers, all GSAP-driven via refs.
// Zero useState. Zero re-renders during mouse tracking.
//
// Layer 1: Outer circle  — mix-blend-mode: difference, white fill
//          Inverts whatever sits behind it (dark bg → white circle,
//          light text → dark circle). The signature "modern mystic" tell.
//
// Layer 2: Inner dot     — snaps to cursor, accent gold, no blend mode
//
// Layer 3: Hover label   — "Explore" / "Navigate" text appears on
//          interactive elements via data-cursor-label attribute
//
// Mouse tracking uses gsap.quickTo (pre-allocated tweens).
// Hover detection uses MutationObserver for SPA-safe re-attachment.
// Hidden on touch devices via CSS + matchMedia guard.
// ─────────────────────────────────────────────────────────────

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Track if device has fine pointer (no touch-only)
  const hasPointer = useRef(false);

  const setup = useCallback(() => {
    const outer = outerRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!outer || !dot || !label) return;

    // ── quickTo: pre-allocated tweens, extremely cheap per-frame ──
    const outerX = gsap.quickTo(outer, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    const outerY = gsap.quickTo(outer, "y", {
      duration: 0.6,
      ease: "power3.out",
    });
    const dotX = gsap.quickTo(dot, "x", {
      duration: 0.12,
      ease: "power2.out",
    });
    const dotY = gsap.quickTo(dot, "y", {
      duration: 0.12,
      ease: "power2.out",
    });

    // ── Mouse move handler ──
    const onMouseMove = (e: MouseEvent) => {
      outerX(e.clientX);
      outerY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    // ── Hover states ──
    const onEnterInteractive = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const cursorLabel = target.getAttribute("data-cursor-label");

      // Expand outer circle
      gsap.to(outer, {
        scale: 2.5,
        duration: 0.5,
        ease: "power3.out",
      });

      // Shrink dot
      gsap.to(dot, {
        scale: 0.4,
        opacity: 0.5,
        duration: 0.4,
        ease: "power3.out",
      });

      // Show label if data-cursor-label present
      if (cursorLabel) {
        label.textContent = cursorLabel;
        gsap.to(label, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    };

    const onLeaveInteractive = () => {
      gsap.to(outer, {
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(dot, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(label, {
        opacity: 0,
        scale: 0.8,
        duration: 0.25,
        ease: "power2.in",
      });
    };

    // ── Magnetic pull on [data-cursor-magnetic] elements ──
    const onMagneticMove = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // Pull element toward cursor (30% of distance)
      gsap.to(target, {
        x: dx * 0.3,
        y: dy * 0.3,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onMagneticLeave = (e: Event) => {
      gsap.to(e.currentTarget as HTMLElement, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    };

    // ── Selector for interactive elements ──
    const interactiveSelector =
      "a, button, [data-cursor-hover], [data-cursor-label]";
    const magneticSelector = "[data-cursor-magnetic]";

    const attachListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
      document.querySelectorAll(magneticSelector).forEach((el) => {
        el.addEventListener("mousemove", onMagneticMove as EventListener);
        el.addEventListener("mouseleave", onMagneticLeave);
      });
    };

    const detachListeners = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
      document.querySelectorAll(magneticSelector).forEach((el) => {
        el.removeEventListener("mousemove", onMagneticMove as EventListener);
        el.removeEventListener("mouseleave", onMagneticLeave);
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    attachListeners();

    // Re-attach on DOM mutations (SPA nav, dynamic content)
    const observer = new MutationObserver(() => {
      detachListeners();
      attachListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      detachListeners();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Guard: skip on touch-only devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    hasPointer.current = true;

    // Initial state — hidden until first mousemove
    if (outerRef.current) gsap.set(outerRef.current, { opacity: 0 });
    if (dotRef.current) gsap.set(dotRef.current, { opacity: 0 });

    const showCursor = () => {
      gsap.to(outerRef.current, { opacity: 1, duration: 0.4 });
      gsap.to(dotRef.current, { opacity: 1, duration: 0.4 });
      window.removeEventListener("mousemove", showCursor);
    };
    window.addEventListener("mousemove", showCursor, { once: true });

    const cleanup = setup();
    return () => {
      window.removeEventListener("mousemove", showCursor);
      cleanup?.();
    };
  }, [setup]);

  return (
    <>
      {/* ── Outer circle: mix-blend-mode: difference ──
          White fill on dark bg → inverts to bright circle.
          Over light text → inverts to dark cutout.
          This is the "X-ray" effect that defines the cursor. */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden md:block"
        style={{
          width: 48,
          height: 48,
          marginLeft: -24,
          marginTop: -24,
          borderRadius: "50%",
          backgroundColor: "white",
          mixBlendMode: "difference",
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        {/* ── Hover label — centered inside outer circle ── */}
        <span
          ref={labelRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-[family-name:var(--font-geist-mono)] text-[8px] uppercase tracking-[0.2em] text-black opacity-0"
          style={{ transform: "scale(0.8)" }}
        >
          {""}
        </span>
      </div>

      {/* ── Inner dot: accent gold, direct tracking ── */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden md:block"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          backgroundColor: "var(--v-accent)",
          willChange: "transform",
          mixBlendMode: "difference",
        }}
        aria-hidden="true"
      />
    </>
  );
}
