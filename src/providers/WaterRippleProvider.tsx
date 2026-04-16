"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────
// WaterRippleProvider — jquery.ripples fullscreen layer (z-45)
//
// Samples a generated gradient texture (CSS gradients alone are not
// enough for this plugin). Non-interactive; optional programmatic drops
// via context (e.g. menu open at trigger center).
// ─────────────────────────────────────────────────────────────

export type WaterRippleApi = {
  dropAtClientPoint: (
    clientX: number,
    clientY: number,
    radius?: number,
    strength?: number
  ) => void;
};

const WaterRippleContext = createContext<WaterRippleApi | null>(null);

const noopApi: WaterRippleApi = {
  dropAtClientPoint: () => {},
};

function makeRippleTextureDataUrl(width = 512, height = 512): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, "#050505");
  g.addColorStop(0.45, "#0a0a0a");
  g.addColorStop(1, "#111111");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  const cx = width * 0.72;
  const cy = height * 0.28;
  const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.55);
  rg.addColorStop(0, "rgba(212,168,83,0.09)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL("image/png");
}

export function useWaterRipple(): WaterRippleApi {
  return useContext(WaterRippleContext) ?? noopApi;
}

type Props = { children: ReactNode };

export default function WaterRippleProvider({ children }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const jqueryRef = useRef<JQueryStatic | null>(null);
  const readyRef = useRef(false);

  const dropAtClientPoint = useCallback(
    (clientX: number, clientY: number, radius = 26, strength = 0.1) => {
      const $ = jqueryRef.current;
      const el = layerRef.current;
      if (!$ || !el || !readyRef.current) return;
      try {
        const br = el.getBoundingClientRect();
        const x = clientX - br.left;
        const y = clientY - br.top;
        $(el).ripples("drop", x, y, radius, strength);
      } catch {
        /* WebGL / plugin edge */
      }
    },
    []
  );

  const api = useMemo<WaterRippleApi>(
    () => ({ dropAtClientPoint }),
    [dropAtClientPoint]
  );

  useEffect(() => {
    const el = layerRef.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let cancelled = false;
    let ro: ResizeObserver | null = null;

    const updateSize = () => {
      const $ = jqueryRef.current;
      if (!$ || !readyRef.current) return;
      try {
        $(el).ripples("updateSize");
      } catch {
        /* noop */
      }
    };

    (async () => {
      const [{ default: $ }, _ripples] = await Promise.all([
        import("jquery"),
        import("jquery.ripples"),
      ]);
      void _ripples;
      if (cancelled) return;

      jqueryRef.current = $;

      const imageUrl = makeRippleTextureDataUrl();
      if (!imageUrl) return;

      try {
        $(el).ripples({
          imageUrl,
          interactive: false,
          resolution: 256,
          dropRadius: 20,
          perturbance: 0.035,
        });
        readyRef.current = true;
      } catch {
        readyRef.current = false;
        return;
      }

      if (cancelled) {
        try {
          $(el).ripples("destroy");
        } catch {
          /* noop */
        }
        readyRef.current = false;
        return;
      }

      ro = new ResizeObserver(() => updateSize());
      ro.observe(el);
      window.addEventListener("resize", updateSize);
    })();

    return () => {
      cancelled = true;
      readyRef.current = false;
      ro?.disconnect();
      window.removeEventListener("resize", updateSize);
      const $ = jqueryRef.current;
      if ($ && el) {
        try {
          $(el).ripples("destroy");
        } catch {
          /* noop */
        }
      }
      jqueryRef.current = null;
    };
  }, []);

  return (
    <WaterRippleContext.Provider value={api}>
      {children}
      <div
        ref={layerRef}
        className="pointer-events-none fixed inset-0 z-[45] opacity-[0.42] mix-blend-soft-light"
        aria-hidden
      />
    </WaterRippleContext.Provider>
  );
}
