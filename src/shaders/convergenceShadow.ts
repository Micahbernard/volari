// ─────────────────────────────────────────────────────────────
// Convergence Shadow Shader
//
// A fullscreen fragment shader for The Convergence section.
// Organic darkness encroaches from screen edges as the user scrolls,
// while a trailing light source (mapped to mouse) repels the shadow.
// Scroll velocity agitates the noise field — faster scrolling =
// more violent shadow movement.
//
// Architecture:
//   1. 3D simplex noise for organic, non-tiling turbulence
//   2. fBm with domain warping for ink-like fluidity
//   3. Edge-driven consume mask (grows inward from all edges)
//   4. Mouse light repulsor — radial falloff pushes shadow back
//   5. Scroll velocity modulates noise amplitude and speed
//   6. Violet-tinged core warmth, cool edges
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
  uniform vec2  uLightPos;       // Mouse in 0..1 UV space
  uniform float uScrollProgress; // 0..1 — darkness encroachment
  uniform float uScrollVelocity; // Lenis scroll velocity
  uniform float uLightPulse;     // 0..1 — card hover pulse burst
  uniform float uActive;

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
  // Rotated-octave fBm for axis-aligned artefact breaking
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

  // ───── Tendrils (polar-space sampling) ─────
  float tendrils(vec2 p, float t, vec2 center) {
    vec2 d = p - center;
    float ang = atan(d.y, d.x);
    float rad = length(d);
    vec2 polar = vec2(ang * 2.2, rad * 4.5 - t * 1.05);
    float n = turbulentInk(polar, t * 0.55);
    float s = smoothstep(0.44, 0.78, n);
    return pow(s, 1.4);
  }

  // ───── Edge encroachment mask ─────
  // Darkness grows inward from all edges, consuming the center.
  // Uses a rounded-rect SDF for organic, slightly irregular edges.
  float edgeConsume(vec2 uv, float progress, float t) {
    // Shrink the safe rect as progress increases
    float margin = (1.0 - progress) * 0.5;
    // Add noise to margin for irregular, organic edge
    float edgeNoise = snoise(vec3(uv * 3.0, t * 0.3)) * 0.08;
    margin += edgeNoise * progress;
    // Rounded rect SDF
    vec2 d = abs(uv - 0.5) - (0.5 - margin - 0.25 * progress);
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float feather = 0.15 + 0.05 * sin(t * 2.1);
    return 1.0 - smoothstep(-feather, feather, dist);
  }

  // ───── Light repulsor ─────
  // The mouse cursor casts a radial pool of light that pushes
  // shadow density back. Intensity modulated by scroll progress.
  float lightRepulsor(vec2 uv, vec2 lightPos, float progress, float pulse) {
    float d = length(uv - lightPos);
    float baseRadius = 0.18 + progress * 0.12;
    float pulseRadius = pulse * 0.45;
    float radius = baseRadius + pulseRadius;
    float intensity = 1.0 - smoothstep(0.0, radius, d);
    // Sharper falloff in center
    intensity = pow(intensity, 1.6);
    // Pulse adds a secondary ring
    float ring = smoothstep(radius * 0.8, radius, d) * smoothstep(radius * 1.4, radius, d);
    intensity += ring * pulse * 0.5;
    return intensity;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv.y = 1.0 - uv.y;

    float aspect = uResolution.x / uResolution.y;
    float t = uTime;

    // Velocity-agitated time — faster scroll = faster noise
    float velAggro = 1.0 + abs(uScrollVelocity) * 3.5;
    float agitatedT = t * velAggro;

    // Aspect-corrected sample space
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 center = vec2(0.5 * aspect, 0.5);

    // ── Ink body ──
    vec2 inkP = p * 2.4 + 0.55 * (p - center) / max(length(p - center), 0.06);
    float ink = turbulentInk(inkP, agitatedT);
    ink = smoothstep(0.28, 0.88, ink);

    // ── Tendrils ──
    float tend = tendrils(p * 1.15, agitatedT, center);

    // ── Edge consume front ──
    float consume = edgeConsume(uv, uScrollProgress, t);
    // Tendrils extend past the main front
    float tendrilReach = smoothstep(0.0, 0.35, consume);

    // ── Composite shadow density ──
    float interior = mix(0.58, 0.92, uScrollProgress);
    float shadow = consume * mix(ink, 1.0, interior);
    shadow = max(shadow, tend * tendrilReach * 0.95);
    shadow = pow(shadow, mix(1.5, 0.7, uScrollProgress));

    // ── Light repulsor ──
    vec2 lightUV = vec2(uLightPos.x, 1.0 - uLightPos.y);
    float light = lightRepulsor(uv, lightUV, uScrollProgress, uLightPulse);
    // Light pushes shadow back
    shadow = max(0.0, shadow - light * 0.85);

    // ── Velocity shimmer ──
    // Fast scrolling adds a subtle shimmer to shadow edges
    float shimmer = abs(uScrollVelocity) * 0.15 * snoise(vec3(p * 8.0, t * 2.0));
    shadow += shimmer * consume;

    // Master visibility
    shadow *= uActive;
    shadow = clamp(shadow, 0.0, 1.0);

    // ── Colour ──
    // Deep matte black edges, violet-tinged near-black core
    vec3 edgeBlack = vec3(0.010, 0.008, 0.014);
    vec3 coreBlack = vec3(0.028, 0.020, 0.042);
    float coreBlend = smoothstep(0.9, 0.0, length(uv - 0.5)) * (1.0 - uScrollProgress);
    vec3 tint = mix(edgeBlack, coreBlack, coreBlend);

    // Light adds a warm gold-tinged glow at cursor position
    vec3 lightTint = vec3(0.85, 0.72, 0.52);
    tint = mix(tint, lightTint, light * 0.08 * uActive);

    gl_FragColor = vec4(tint, shadow);
  }
`;
