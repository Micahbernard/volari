import "jquery";

/** Side-effect module: registers `$.fn.ripples` on jQuery. */
declare module "jquery.ripples";

export interface JQueryRipplesOptions {
  imageUrl?: string | null;
  interactive?: boolean;
  resolution?: number;
  dropRadius?: number;
  perturbance?: number;
  crossOrigin?: string;
}

declare global {
  interface JQuery {
    ripples(options?: JQueryRipplesOptions): JQuery;
    ripples(
      method: "drop",
      x: number,
      y: number,
      radius: number,
      strength: number
    ): JQuery;
    ripples(method: "destroy" | "updateSize"): JQuery;
  }
}

export {};
