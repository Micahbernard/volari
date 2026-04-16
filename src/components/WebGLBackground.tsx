"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/shaders/fluidBackground";

// ─────────────────────────────────────────────────────────────
// Performance constants
// ─────────────────────────────────────────────────────────────
const DPR_RANGE: [number, number] = [1, 1.5];
const MOUSE_LERP = 0.04;
const PLANE_SEGMENTS = 160;

// ─────────────────────────────────────────────────────────────
// FluidPlane — 128×128 segmented mesh with vertex displacement
//
// All state in useRef. Zero re-renders during animation.
// Uniforms mutated directly in useFrame.
// Plane auto-scales to viewport via useThree().viewport.
// ─────────────────────────────────────────────────────────────
/** Time scale for shader uTime: full motion vs reduced-motion (see volari-engineering-constraints). */
const FULL_MOTION_TIME_SCALE = 1;
const REDUCED_MOTION_TIME_SCALE = 0.1;

function FluidPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Mutable animation state
  const mouseTarget = useRef({ x: 0.5, y: 0.5 });
  const mouseCurrent = useRef({ x: 0.5, y: 0.5 });
  const scrollProgress = useRef(0);
  const motionTimeScale = useRef(FULL_MOTION_TIME_SCALE);

  // Shader uniforms — created once, mutated per-frame
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollProgress: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          typeof window !== "undefined" ? window.innerWidth : 1920,
          typeof window !== "undefined" ? window.innerHeight : 1080
        ),
      },
    }),
    []
  );

  /** Pointer covers mouse, pen, and touch — mousemove alone misses touch drag. */
  const onPointerMove = useCallback((e: PointerEvent) => {
    mouseTarget.current.x = e.clientX / window.innerWidth;
    mouseTarget.current.y = 1.0 - e.clientY / window.innerHeight;
  }, []);

  const onScroll = useCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.current = max > 0 ? window.scrollY / max : 0;
  }, []);

  const onResize = useCallback(() => {
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }, [uniforms]);

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onResize();
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [onPointerMove, onScroll, onResize]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      motionTimeScale.current = mq.matches
        ? REDUCED_MOTION_TIME_SCALE
        : FULL_MOTION_TIME_SCALE;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useFrame(({ clock }) => {
    const mat = materialRef.current;
    if (!mat) return;

    mat.uniforms.uTime.value =
      clock.getElapsedTime() * motionTimeScale.current;
    mat.uniforms.uScrollProgress.value = scrollProgress.current;

    mouseCurrent.current.x +=
      (mouseTarget.current.x - mouseCurrent.current.x) * MOUSE_LERP;
    mouseCurrent.current.y +=
      (mouseTarget.current.y - mouseCurrent.current.y) * MOUSE_LERP;

    mat.uniforms.uMouse.value.set(
      mouseCurrent.current.x,
      mouseCurrent.current.y
    );
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry
        args={[viewport.width, viewport.height, PLANE_SEGMENTS, PLANE_SEGMENTS]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────
// WebGLBackground — Public component
//
// Fixed behind all content at -z-1 (see volari-engineering-constraints.mdc).
// Canvas GL config stripped to minimum for fullscreen shader:
//   antialias: false, alpha: false, stencil: false, depth: false
// ─────────────────────────────────────────────────────────────
export default function WebGLBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-1"
      aria-hidden="true"
    >
      <Canvas
        camera={{
          position: [0, 0, 1],
          near: 0.1,
          far: 10,
          fov: 75,
        }}
        dpr={DPR_RANGE}
        gl={{
          antialias: false,
          alpha: false,
          stencil: false,
          depth: false,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        frameloop="always"
        flat
        style={{ background: "#050505" }}
      >
        <FluidPlane />
      </Canvas>
    </div>
  );
}
