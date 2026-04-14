"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// PageTransition — Framer Motion enter/exit for page content.
//
// Used for simple presence animations only. All scroll-driven
// and timeline animations remain GSAP (per architectural mandate).
//
// Enter: opacity 0→1, y 16→0, 0.6s, expo-out [0.16, 1, 0.3, 1]
// Exit:  opacity 1→0, 0.3s, expo-in [0.7, 0, 0.84, 0]
// ─────────────────────────────────────────────────────────────
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1], // expo out
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.3,
          ease: [0.7, 0, 0.84, 0], // expo in
        },
      }}
    >
      {children}
    </motion.div>
  );
}
