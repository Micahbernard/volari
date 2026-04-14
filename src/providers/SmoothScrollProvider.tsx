"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins once at module scope
gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Bridge Lenis → GSAP ScrollTrigger
    // This is critical: every Lenis scroll event triggers a ScrollTrigger update
    // so GSAP-driven scroll animations stay perfectly in sync.
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP's ticker as the single animation loop.
    // This avoids a separate rAF loop — everything runs on one heartbeat.
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker time is in seconds, Lenis expects ms
    };

    gsap.ticker.add(tickerCallback);

    // Disable Lenis's internal rAF since GSAP's ticker drives it
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
