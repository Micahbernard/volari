import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import WebGLBackground from "@/components/WebGLBackground";
import PageTransitionProvider from "@/providers/PageTransitionProvider";

// ── Pre-hydration theme script ──
// Runs synchronously before first paint. Reads sessionStorage and stamps
// data-theme onto <html> so every var() resolves to the correct palette
// from the very first rendered frame — no flash of void before flipping to
// day (or vice versa). Wrapped in try/catch because sessionStorage throws
// in private-browsing / sandboxed iframes. Kept minimal + dependency-free
// so it's cheap to parse and evaluate. String, not template literal — no
// backticks, so escaping stays trivial.
const THEME_INIT_SCRIPT =
  "(function(){try{var t=sessionStorage.getItem('volari-theme');" +
  "if(t!=='day'&&t!=='void')t='void';" +
  "document.documentElement.setAttribute('data-theme',t);}" +
  "catch(e){document.documentElement.setAttribute('data-theme','void');}})();";

// ── Typography ──
// Body / UI: Geist Sans — clean geometric sans-serif
// Fixes silent fallback: --font-geist-sans was referenced in CSS but never loaded
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Hero / Display: Playfair Display — razor-thin elegant serif
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

// UI / Metadata: Geist Mono — ultra-minimalist monospace
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ── Metadata ──
export const metadata: Metadata = {
  title: "Volari — Digital Experiences Studio",
  description:
    "Premium digital experiences for brands that demand excellence. Web design, development, and creative technology by Volari.",
  keywords: [
    "Volari",
    "web design",
    "creative agency",
    "digital experiences",
    "premium web development",
  ],
  openGraph: {
    title: "Volari — Digital Experiences Studio",
    description:
      "Premium digital experiences for brands that demand excellence.",
    type: "website",
  },
};

// ── Root Layout ──
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning on <html> — the pre-hydration script below
    // stamps data-theme onto this element, which differs from the SSR
    // markup. Without this React 19 would log a hydration mismatch warning
    // on every page load. Scoped to the single attribute it affects; the
    // warning suppression does NOT cascade to descendants.
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme init — must run before ANY styled content paints.
            Placed in <head> so it executes during document parse, ahead
            of body rendering and React hydration. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-screen text-v-chalk">
        <ThemeProvider>
          <SmoothScrollProvider>
            {/* WebGL fluid background — fixed -z-1 */}
            <WebGLBackground />

            {/* Navigation — fixed z-50 */}
            <Navbar />

            {/* Custom cursor — fixed, above everything */}
            <CustomCursor />

            {/* Page content */}
            <main className="relative z-10">
              <PageTransitionProvider>{children}</PageTransitionProvider>
            </main>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
