import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import WebGLBackground from "@/components/WebGLBackground";
import PageTransitionProvider from "@/providers/PageTransitionProvider";

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
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-v-black text-v-chalk">
        <SmoothScrollProvider>
          {/* WebGL fluid background — fixed, behind everything */}
          <WebGLBackground />

          {/* Navigation — fixed z-50, above content */}
          <Navbar />

          {/* Custom cursor — fixed, above everything */}
          <CustomCursor />

          {/* Page content — z-0 naturally stacks above the -z-10 canvas */}
          <main className="relative">
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
