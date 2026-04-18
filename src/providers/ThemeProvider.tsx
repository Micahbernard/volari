"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

// ─────────────────────────────────────────────────────────────
// Theme model
//
// Two themes: "void" (default, dark) and "day" (daybreak cream).
// Source of truth: `data-theme` attribute on <html>.
// Persistence: sessionStorage per tab — a fresh tab always starts
// in void so the flip remains a deliberate discovery act, not a
// sticky preference.
// ─────────────────────────────────────────────────────────────

export type Theme = "void" | "day";

const STORAGE_KEY = "volari-theme";
/** Matches `body.theme-flipping` / View Transition animations in globals.css and shader warp envelope in WebGLBackground. */
export const FLIP_DURATION_MS = 1500;

/** Stamp crest centre (px) for radial sunlight / void clip-path + shader origin. Cleans up after flip. */
function setFlipOriginCss(originElement?: HTMLElement) {
  const root = document.documentElement;
  if (originElement) {
    const r = originElement.getBoundingClientRect();
    const ox = r.left + r.width / 2;
    const oy = r.top + r.height / 2;
    root.style.setProperty("--flip-ox", `${ox}px`);
    root.style.setProperty("--flip-oy", `${oy}px`);
  } else {
    root.style.setProperty("--flip-ox", `${window.innerWidth / 2}px`);
    root.style.setProperty("--flip-oy", `${Math.min(96, window.innerHeight * 0.12)}px`);
  }
}

function clearFlipOriginCss() {
  const root = document.documentElement;
  root.style.removeProperty("--flip-ox");
  root.style.removeProperty("--flip-oy");
}

// ─────────────────────────────────────────────────────────────
// Shader bridge — module-level
//
// WebGLBackground registers a flip callback on mount; ThemeProvider
// invokes it directly when toggleTheme fires. We intentionally do
// NOT use a window event or React context for this wire — a direct
// function reference has exactly one failure point (registration)
// and no subscriber races. The callback receives the target theme
// so the shader can lerp to the correct palette.
// ─────────────────────────────────────────────────────────────

// `instant: true` means "snap uFlip to the target value right now, don't lerp."
// Used by the View Transitions path so the browser's snapshot of the NEW
// DOM catches the shader at its final palette — otherwise the horizon-rise
// reveal would expose a half-lerped shader frozen in the pseudo-layer.
type ShaderFlipCallback = (target: Theme, instant?: boolean) => void;
let shaderFlipCallback: ShaderFlipCallback | null = null;

/**
 * Called by WebGLBackground on mount. Returns an unregister fn
 * so the effect can clean up on unmount.
 */
export function registerShaderFlip(cb: ShaderFlipCallback): () => void {
  shaderFlipCallback = cb;
  return () => {
    if (shaderFlipCallback === cb) shaderFlipCallback = null;
  };
}

// View Transitions API feature detection — typed narrowly because the API
// lives on Document but isn't yet in lib.dom.d.ts for all our TS targets.
type StartViewTransition = (cb: () => void) => {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
};
function getStartViewTransition(): StartViewTransition | null {
  if (typeof document === "undefined") return null;
  const fn = (document as unknown as { startViewTransition?: StartViewTransition })
    .startViewTransition;
  return typeof fn === "function" ? fn.bind(document) : null;
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme: Theme;
  /**
   * Flip the theme. Pass the crest button so radial sunlight (void→day) and
   * void shadow (day→void) expand from its centre. Without an origin, the
   * viewport centre/top band is used.
   */
  toggleTheme: (originElement?: HTMLElement) => void;
  /** True during the flip window. Consumers (Navbar N° chip) use this to guard a crossfade. */
  isFlipping: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial state read from the DOM — the pre-hydration script in
  // layout.tsx has already set data-theme before first paint, so
  // this matches the SSR-rendered markup and avoids hydration drift.
  const [theme, setTheme] = useState<Theme>("void");
  const [isFlipping, setIsFlipping] = useState(false);

  // Guards a second toggle landing mid-transition (would desync
  // CSS crossfade and shader lerp). Ref, not state, so it updates
  // synchronously inside the click handler.
  const flipLockRef = useRef(false);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync React state to whatever the pre-hydration script set.
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "day" || attr === "void") {
      setTheme(attr);
    } else {
      // Attribute missing (script failed or dev tooling stripped it).
      // Fall back to storage, then default.
      const stored = sessionStorage.getItem(STORAGE_KEY);
      const fallback: Theme = stored === "day" ? "day" : "void";
      document.documentElement.setAttribute("data-theme", fallback);
      setTheme(fallback);
    }
  }, []);

  const toggleTheme = useCallback(
    (originElement?: HTMLElement) => {
      if (flipLockRef.current) return;
      flipLockRef.current = true;

      const current = theme;
      const next: Theme = current === "void" ? "day" : "void";

      // The actual DOM mutation — same for both paths. Packaged as a closure
      // so View Transitions can call it inside startViewTransition's update
      // callback (where the browser brackets a before/after DOM snapshot).
      const applyFlip = (instant: boolean) => {
        document.documentElement.setAttribute("data-theme", next);
        shaderFlipCallback?.(next, instant);
        // flushSync forces React to commit the theme state update synchronously.
        // Required under View Transitions — the browser snapshots <html> the
        // moment this callback returns, so any theme-state-driven DOM (e.g. the
        // Navbar N°01↔N°02 crossfade spans) must be rendered with the NEW
        // state before snapshot, or the NEW snapshot captures stale content
        // and the label appears to "snap" at the end of the wipe.
        flushSync(() => {
          setTheme(next);
        });
        try {
          sessionStorage.setItem(STORAGE_KEY, next);
        } catch {
          // sessionStorage can throw in private-browsing / sandboxed iframes.
          // Persistence failure is non-fatal — the theme still flips for the session.
        }
      };

      setIsFlipping(true);
      setFlipOriginCss(originElement);

      const startViewTransition = getStartViewTransition();
      if (startViewTransition) {
        // Radial View Transitions from crest: rise = sunlight (void→day), set = void (day→void).
        const direction = next === "day" ? "rise" : "set";
        document.documentElement.setAttribute("data-flip-direction", direction);
        const tx = startViewTransition(() => applyFlip(true));
        const cleanup = () => {
          clearFlipOriginCss();
          document.documentElement.removeAttribute("data-flip-direction");
          setIsFlipping(false);
          flipLockRef.current = false;
        };
        tx.finished.then(cleanup, cleanup);
      } else {
        // ── Fallback: color crossfade on body.theme-flipping ──
        // No VT snapshot — radial mask unavailable; crest origin still set for shader + subtle filter.
        const direction = next === "day" ? "rise" : "set";
        document.documentElement.setAttribute("data-flip-direction", direction);
        document.body.classList.add("theme-flipping");
        applyFlip(false);

        if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
        flipTimeoutRef.current = setTimeout(() => {
          document.body.classList.remove("theme-flipping");
          document.documentElement.removeAttribute("data-flip-direction");
          clearFlipOriginCss();
          setIsFlipping(false);
          flipLockRef.current = false;
        }, FLIP_DURATION_MS);
      }
    },
    [theme]
  );

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isFlipping }}>
      {children}
    </ThemeContext.Provider>
  );
}
