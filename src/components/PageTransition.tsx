"use client";

import { motion } from "framer-motion";

// See .cursor/rules/volari-engineering-constraints.mdc — no spring physics;
// cinematic eases; entrance via mask, not simultaneous generic slide+fade.

const EASE_CINEMATIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{
        clipPath: "inset(0 0 0% 0)",
        transition: {
          duration: 1.15,
          ease: EASE_CINEMATIC,
        },
      }}
      exit={{
        clipPath: "inset(0 0 100% 0)",
        transition: {
          duration: 0.85,
          ease: [0.7, 0, 0.84, 0],
        },
      }}
    >
      {children}
    </motion.div>
  );
}
