// ─────────────────────────────────────────────────────────────
// shadowConsume.ts ✦ The Convergence Shader
//
// A fullscreen fragment shader simulating the Hollow Knight Void:
// creeping, organic darkness that consumes from screen edges inward.
// The cursor casts a pool of light that violently repels tendrils.
// Scroll velocity agitates the noise — fast scroll = volatile shadows.
//
// Architecture:
//   1. 3D simplex noise (Ashima Arts) — organic, non-tiling
//   2. Rotated-octave fBm for axis-aligned artefact breaking
//   3. Double domain warp for ink-like fluid self-folding
//   4. Edge-driven SDF consume mask with heavy noise perturbation
//   5. Tendrils in polar space reaching past the main front
//   6. Mouse repulsor with sharp exponential falloff
//   7. Scroll velocity modulates noise amplitude and speed
//   8. Violet-tinged near-black palette
// ─────────────────────────────────────────────────────────────

export const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2  uResolution;
  uniform float uTime;
  uniform vec2  uMouse;           // 0..1 UV space, Y flipped
  uniform float uScrollProgress;  // 0..1 darkness encroachment
  uniform float uScrollVelocity;  // Lenis velocity
  uniform float uLightPulse;      // Card hover burst 0..1
  uniform float uActive;          // Master visibility

  // ───── 3D Simplex Noise (Ashima Arts / Ian McEwan) ─────
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // ───── Fractional Brownian Motion ─────
  float fbm(vec2 p, float t) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 5; i++) {
      v += a * snoise(vec3(p, t));
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  // ───── Turbulent Ink (double domain warp) ─────
  float turbulentInk(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.08 * t), t * 0.15),
      fbm(p + vec2(3.1, 1.7) + vec2(0.0, 0.07 * t), t * 0.13)
    );
    vec2 r = vec2(
      fbm(p + 3.2 * q + vec2(1.7, 9.2) - vec2(0.0, 0.11 * t), t * 0.12),
      fbm(p + 3.2 * q + vec2(8.3, 2.8) + vec2(0.0, 0.09 * t), t * 0.14)
    );
    return fbm(p + 4.0 * r, t * 0.1);
  }

  // ───── Tendrils (polar-space) ─────
  float tendrils(vec2 p, float t, vec2 center) {
    vec2 d = p - center;
    float ang = atan(d.y, d.x);
    float rad = length(d);
    vec2 polar = vec2(ang * 2.2, rad * 4.5 - t * 1.05);
    float n = turbulentInk(polar, t * 0.55);
    float s = smoothstep(0.44, 0.78, n);
    return pow(s, 1.4);
  }

  // ───── Edge encroachment mask (rounded rect SDF) ─────
  float edgeConsume(vec2 uv, float progress, float t) {
    float margin = (1.0 - progress) * 0.5;
    // Heavy noise perturbation for organic, irregular edge
    float edgeNoise = snoise(vec3(uv * 3.0, t * 0.3)) * 0.12;
    edgeNoise += snoise(vec3(uv * 7.0, t * 0.5)) * 0.06;
    margin += edgeNoise * progress;
    // Rounded rect SDF
    vec2 d = abs(uv - 0.5) - (0.5 - margin - 0.25 * progress);
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float feather = 0.18 + 0.06 * sin(t * 2.1 + uv.x * 3.0);
    return 1.0 - smoothstep(-feather, feather, dist);
  }

  // ───── Mouse repulsor (violent light push-back) ─────
  float mouseRepulsor(vec2 uv, vec2 mouse, float progress) {
    // Flip Y for shader space
    vec2 m = vec2(mouse.x, 1.0 - mouse.y);
    float d = length(uv - m);
    float baseRadius = 0.20 + progress * 0.15;
    // Sharp exponential falloff for violent push-back
    float intensity = exp(-d * d / (baseRadius * baseRadius * 0.5));
    // Secondary tighter core
    float core = exp(-d * d / (baseRadius * baseRadius * 0.12));
    intensity += core * 0.4;
    return intensity;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv.y = 1.0 - uv.y; // Flip Y for top-left origin

    float aspect = uResolution.x / uResolution.y;
    float t = uTime;

    // Scroll agitation: velocity boosts both speed and amplitude
    float velMag = abs(uScrollVelocity);
    float velAggro = 1.0 + velMag * 4.0;
    float velAmp = 1.0 + velMag * 2.5;
    float agitatedT = t * velAggro;

    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 center = vec2(0.5 * aspect, 0.5);

    // ── Ink body ──
    vec2 inkP = p * 2.8 * velAmp + 0.55 * (p - center) / max(length(p - center), 0.06);
    float ink = turbulentInk(inkP, agitatedT);
    ink = smoothstep(0.28, 0.88, ink);

    // ── Tendrils ──
    float tend = tendrils(p * 1.15, agitatedT, center);

    // ── Edge consume front ──
    float consume = edgeConsume(uv, uScrollProgress, agitatedT);
    float tendrilReach = smoothstep(0.0, 0.40, consume);

    // ── Composite shadow density ──
    float interior = mix(0.55, 0.94, uScrollProgress);
    float shadow = consume * mix(ink, 1.0, interior);
    shadow = max(shadow, tend * tendrilReach * 0.95);
    shadow = pow(shadow, mix(1.6, 0.65, uScrollProgress));

    // ── Mouse repulsor ──
    float light = mouseRepulsor(uv, uMouse, uScrollProgress);
    shadow = max(0.0, shadow - light * 0.95);

    // ── Light pulse burst (card hover) ──
    if (uLightPulse > 0.01) {
      float pulseDist = length(uv - vec2(uMouse.x, 1.0 - uMouse.y));
      float pulseRadius = 0.35 * uLightPulse;
      float pulseRing = smoothstep(pulseRadius * 1.3, pulseRadius * 0.5, pulseDist);
      pulseRing *= smoothstep(0.0, pulseRadius * 0.3, pulseDist);
      shadow = max(0.0, shadow - pulseRing * uLightPulse * 1.2);
    }

    // ── Velocity edge shimmer ──
    float shimmer = velMag * 0.2 * snoise(vec3(p * 10.0, t * 3.0));
    shadow += shimmer * consume;

    // Master visibility
    shadow *= uActive;
    shadow = clamp(shadow, 0.0, 1.0);

    // ── Colour ──
    vec3 edgeBlack = vec3(0.009, 0.007, 0.013);
    vec3 coreBlack = vec3(0.032, 0.022, 0.048);
    float coreBlend = smoothstep(0.9, 0.0, length(uv - 0.5)) * (1.0 - uScrollProgress);
    vec3 tint = mix(edgeBlack, coreBlack, coreBlend);

    // Subtle gold warmth where light touches
    vec3 lightTint = vec3(0.88, 0.74, 0.54);
    float lightMask = smoothstep(0.0, 0.25, light);
    tint = mix(tint, lightTint, lightMask * 0.06 * uActive);

    gl_FragColor = vec4(tint, shadow);
  }
`;
