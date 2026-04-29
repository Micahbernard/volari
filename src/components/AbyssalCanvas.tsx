"use client";

import { useRef, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/shaders/shadowConsume";

// ─────────────────────────────────────────────────────────────
// AbyssalCanvas ✦ The Convergence Background
//
// CRITICAL ARCHITECTURE:
//   - Canvas wrapper: position:absolute, inset:0, z-index:0
//   - pointer-events:none so DOM receives all interaction
//   - Mouse coordinates fed via ref from global window listener
//   - Zero React re-renders — all uniforms mutated in useFrame
// ─────────────────────────────────────────────────────────────

const MOUSE_LERP = 0.06;
const PULSE_DECAY = 0.82;
const VELOCITY_DECAY = 0.90;

interface ShaderPlaneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollVelocityRef: React.MutableRefObject<number>;
  lightPulseRef: React.MutableRefObject<number>;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
}

function ShaderPlane({
  scrollProgressRef,
  scrollVelocityRef,
  lightPulseRef,
  mousePosRef,
}: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smoothedMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const timeRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollProgress: { value: 0 },
      uScrollVelocity: { value: 0 },
      uLightPulse: { value: 0 },
      uActive: { value: 1 },
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      }),
    [uniforms]
  );

  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const dt = Math.min(delta, 0.05);
    timeRef.current += dt;
    uniforms.uTime.value = timeRef.current;

    // Smooth mouse lerp (fed from global window listener via ref)
    const mx = mousePosRef.current.x;
    const my = mousePosRef.current.y;
    smoothedMouse.current.x += (mx - smoothedMouse.current.x) * MOUSE_LERP;
    smoothedMouse.current.y += (my - smoothedMouse.current.y) * MOUSE_LERP;
    uniforms.uMouse.value.set(smoothedMouse.current.x, smoothedMouse.current.y);

    // Scroll uniforms
    uniforms.uScrollProgress.value = scrollProgressRef.current;
    uniforms.uScrollVelocity.value = scrollVelocityRef.current;

    // Pulse decay
    const pulse = lightPulseRef.current;
    uniforms.uLightPulse.value = pulse;
    lightPulseRef.current *= PULSE_DECAY;
    if (lightPulseRef.current < 0.002) lightPulseRef.current = 0;

    // Velocity decay
    scrollVelocityRef.current *= VELOCITY_DECAY;
    if (Math.abs(scrollVelocityRef.current) < 0.001)
      scrollVelocityRef.current = 0;

    // Resolution sync
    const { width, height } = state.viewport;
    uniforms.uResolution.value.set(
      width * state.size.width,
      height * state.size.height
    );
  });

  return (
    <mesh
      ref={meshRef}
      material={material}
      geometry={geometry}
      frustumCulled={false}
    />
  );
}

export interface AbyssalCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollVelocityRef: React.MutableRefObject<number>;
  lightPulseRef: React.MutableRefObject<number>;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
}

const AbyssalCanvas = memo(function AbyssalCanvas({
  scrollProgressRef,
  scrollVelocityRef,
  lightPulseRef,
  mousePosRef,
}: AbyssalCanvasProps) {
  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        camera={{ position: [0, 0, 1], fov: 75, near: 0.1, far: 10 }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          position: "absolute",
          inset: 0,
        }}
      >
        <ShaderPlane
          scrollProgressRef={scrollProgressRef}
          scrollVelocityRef={scrollVelocityRef}
          lightPulseRef={lightPulseRef}
          mousePosRef={mousePosRef}
        />
      </Canvas>
    </div>
  );
});

export default AbyssalCanvas;
