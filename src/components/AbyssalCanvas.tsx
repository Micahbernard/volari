"use client";

import { useRef, useMemo, useCallback, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "@/shaders/convergenceShadow";

// ─────────────────────────────────────────────────────────────
// AbyssalCanvas ✦ The Convergence — R3F Background
//
// A fullscreen shader plane that renders living shadow tendrils
// consumed by scroll, repelled by mouse light. Lives absolutely
// positioned behind the DOM content layer.
// ─────────────────────────────────────────────────────────────

const PLANE_SEGMENTS = 1; // Fullscreen quad, no subdivision needed
const MOUSE_LERP = 0.06;
const LIGHT_PULSE_DECAY = 0.92; // Pulse decays per frame

interface ShaderPlaneProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollVelocityRef: React.MutableRefObject<number>;
  lightPulseRef: React.MutableRefObject<number>;
}

/** The actual shader mesh — isolated for clean re-render boundaries. */
function ShaderPlane({
  scrollProgressRef,
  scrollVelocityRef,
  lightPulseRef,
}: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothedMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
      uLightPos: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollProgress: { value: 0 },
      uScrollVelocity: { value: 0 },
      uLightPulse: { value: 0 },
      uActive: { value: 1 },
    }),
    []
  );

  // Keep resolution uniform in sync with canvas size
  useMemo(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

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

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(2, 2, PLANE_SEGMENTS, PLANE_SEGMENTS),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const t = performance.now() * 0.001;
    uniforms.uTime.value = t;

    // Smooth mouse lerp
    smoothedMouseRef.current.x +=
      (mouseRef.current.x - smoothedMouseRef.current.x) * MOUSE_LERP;
    smoothedMouseRef.current.y +=
      (mouseRef.current.y - smoothedMouseRef.current.y) * MOUSE_LERP;
    uniforms.uLightPos.value.set(
      smoothedMouseRef.current.x,
      smoothedMouseRef.current.y
    );

    // Scroll values from refs (updated by Lenis scroll handler)
    uniforms.uScrollProgress.value = scrollProgressRef.current;
    uniforms.uScrollVelocity.value = scrollVelocityRef.current;

    // Light pulse — decays exponentially, triggered by card hover
    const pulse = lightPulseRef.current;
    uniforms.uLightPulse.value = pulse;
    lightPulseRef.current *= LIGHT_PULSE_DECAY;
    if (lightPulseRef.current < 0.001) lightPulseRef.current = 0;

    // Decay scroll velocity so it doesn't persist
    scrollVelocityRef.current *= 0.95;
    if (Math.abs(scrollVelocityRef.current) < 0.001)
      scrollVelocityRef.current = 0;
  });

  const onPointerMove = useCallback(
    (e: THREE.Event & { uv?: THREE.Vector2 }) => {
      // R3F uv is in 0..1 space
      if (e.uv) {
        mouseRef.current.set(e.uv.x, e.uv.y);
      }
    },
    []
  );

  return (
    <mesh
      ref={meshRef}
      material={material}
      geometry={geometry}
      frustumCulled={false}
      onPointerMove={onPointerMove}
    >
      {/* No children — geometry attached via ref */}
    </mesh>
  );
}

/** Props exposed to the section parent. */
export interface AbyssalCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollVelocityRef: React.MutableRefObject<number>;
  lightPulseRef: React.MutableRefObject<number>;
  className?: string;
}

/** Canvas wrapper — absolute positioned, rendered behind DOM. */
const AbyssalCanvas = memo(function AbyssalCanvas({
  scrollProgressRef,
  scrollVelocityRef,
  lightPulseRef,
  className = "",
}: AbyssalCanvasProps) {
  return (
    <div
      className={`absolute inset-0 -z-10 ${className}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 1], fov: 75, near: 0.1, far: 10 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ShaderPlane
          scrollProgressRef={scrollProgressRef}
          scrollVelocityRef={scrollVelocityRef}
          lightPulseRef={lightPulseRef}
        />
      </Canvas>
    </div>
  );
});

export default AbyssalCanvas;
