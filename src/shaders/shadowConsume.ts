// ─────────────────────────────────────────────────────────────
// shadowConsume.ts ✦ The Convergence — Hollow Knight Void
//
// A viscous, inky black liquid that consumes from screen edges.
// NOT soft smoke. NOT gauzy fog. This is *liquid* — thick, 
// high-contrast, self-folding darkness with sharp tendril edges.
//
// The math philosophy:
//   1. smoothstep CRUSHES noise thresholds → hard ink edges
//   2. Domain warp at high amplitude → viscous fluid folding
//   3. Edge SDF with heavy noise perturbation → organic creep
//   4. Mouse repulsor → hard-edged searing white/gold burn
//   5. Scroll velocity → tentacle spikes reaching center
//
// Color: Absolute black. #000000 to #050505. No grey haze.
// Light: Blinding white core, gold bleed at edge. Hard cutoff.
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
  uniform vec2  uMouse;           // 0..1, Y-flipped
  uniform float uScrollProgress;  // 0..1 edge consumption
  uniform float uScrollVelocity;  // Lenis velocity
  uniform float uLightPulse;    // Card hover burst
  uniform float uActive;

  // ───── 3D Simplex Noise (Ashima Arts) ─────
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

  // ───── fBm — 5 octaves, heavy rotation ─────
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

  // ───── Viscous Ink — high-amplitude domain warp ─────
  // This is the key: we warp position BY the noise value at high
  // amplitude, then sample noise again. The result is thick,
  // viscous, self-folding liquid — not soft clouds.
  float viscousInk(vec2 p, float t) {
    // First warp: pull position by fbm value
    vec2 warp1 = vec2(
      fbm(p + vec2(0.0, 0.10 * t), t * 0.2),
      fbm(p + vec2(3.1, 1.7) + vec2(0.0, 0.08 * t), t * 0.18)
    );
    // Second warp: pull AGAIN by the first warp — double fold
    vec2 warp2 = vec2(
      fbm(p + 4.5 * warp1 + vec2(1.7, 9.2) - vec2(0.0, 0.13 * t), t * 0.15),
      fbm(p + 4.5 * warp1 + vec2(8.3, 2.8) + vec2(0.0, 0.11 * t), t * 0.17)
    );
    // Final sample at the double-warped position
    return fbm(p + 5.5 * warp2, t * 0.12);
  }

  // ───── Sharp tendrils — CRUSHED with smoothstep ─────
  // smoothstep with a NARROW band turns soft noise into hard
  // filament edges. This is the "ink" look.
  float inkTendrils(vec2 p, float t, vec2 center) {
    vec2 d = p - center;
    float ang = atan(d.y, d.x);
    float rad = length(d);
    // Polar sample with time shear
    vec2 polar = vec2(ang * 2.5, rad * 5.0 - t * 1.2);
    float n = viscousInk(polar, t * 0.6);
    // CRUSH: narrow smoothstep band = sharp ink edges
    float crushed = smoothstep(0.48, 0.52, n);
    return pow(crushed, 1.6);
  }

  // ───── Edge consumption — 4-sided SDF with heavy noise ─────
  // The void eats from ALL edges simultaneously. Noise perturbs
  // the margin so the edge is ragged, organic, alive.
  float voidConsume(vec2 uv, float progress, float t) {
    // Margin shrinks as progress grows — void eats inward
    float margin = (1.0 - progress) * 0.5;
    // Heavy noise: two octaves for ragged, living edge
    float n1 = snoise(vec3(uv * 2.5, t * 0.25)) * 0.15;
    float n2 = snoise(vec3(uv * 6.0, t * 0.4 + 10.0)) * 0.07;
    margin += (n1 + n2) * progress;
    // Rounded rect SDF — consume from all 4 edges
    vec2 d = abs(uv - 0.5) - (0.5 - margin - 0.22 * progress);
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    // Feather gets narrower as void advances = sharper edge
    float feather = 0.12 + 0.04 * sin(t * 1.8 + uv.x * 4.0);
    return 1.0 - smoothstep(-feather, feather, dist);
  }

  // ───── Scroll spike field ─────
  // Velocity creates reaching tentacles toward center.
  float spikeField(vec2 uv, float progress, float velocity, float t) {
    if (abs(velocity) < 0.3) return 0.0;
    float reach = abs(velocity) * 0.4;
    // Radial spikes from edge
    vec2 d = uv - 0.5;
    float ang = atan(d.y, d.x);
    float rad = length(d);
    float spike = snoise(vec3(ang * 3.0, rad * 2.0 - t * 2.0, t));
    spike = smoothstep(0.35, 0.65, spike);
    // Only at the void edge, reaching inward
    float edgeMask = smoothstep(0.0, 0.25 + reach, progress - rad * 0.6);
    return spike * edgeMask * reach * 1.2;
  }

  // ───── Mouse repulsor — HARD searing light ─────
  // Not a soft gradient. A blinding white core with a hard
  // cutoff that *burns* through the blackness.
  float searingLight(vec2 uv, vec2 mouse, float pulse) {
    vec2 m = vec2(mouse.x, 1.0 - mouse.y);
    float d = length(uv - m);
    // Core: very tight, very bright
    float core = 1.0 - smoothstep(0.0, 0.06, d);
    // Mid: hard falloff
    float mid = 1.0 - smoothstep(0.04, 0.18 + pulse * 0.2, d);
    // Edge: sharp cutoff — no soft blur
    float edge = 1.0 - smoothstep(0.12, 0.24 + pulse * 0.25, d);
    return core * 1.0 + mid * 0.6 + edge * 0.25;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv.y = 1.0 - uv.y;

    float aspect = uResolution.x / uResolution.y;
    float t = uTime;

    // Velocity agitation: faster scroll = faster, more violent
    float vel = abs(uScrollVelocity);
    float velTime = t * (1.0 + vel * 5.0);
    float velAmp = 1.0 + vel * 3.0;

    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 center = vec2(0.5 * aspect, 0.5);

    // ── Ink body — CRUSHED for viscous liquid edges ──
    vec2 inkP = p * 3.0 * velAmp + 0.6 * (p - center) / max(length(p - center), 0.05);
    float ink = viscousInk(inkP, velTime);
    // CRUSH: narrow smoothstep = hard liquid edges
    ink = smoothstep(0.38, 0.42, ink);

    // ── Tendrils — sharp, reaching filaments ──
    float tend = inkTendrils(p * 1.2, velTime, center);

    // ── Void edge consumption ──
    float consume = voidConsume(uv, uScrollProgress, velTime);
    float tendrilReach = smoothstep(0.0, 0.35, consume);

    // ── Scroll spikes — velocity reaches tendrils toward center ──
    float spikes = spikeField(uv, uScrollProgress, uScrollVelocity, velTime);

    // ── Shadow density composite ──
    float interior = mix(0.45, 0.98, uScrollProgress);
    float shadow = consume * mix(ink, 1.0, interior);
    shadow = max(shadow, tend * tendrilReach * 0.95);
    // Add spikes on top
    shadow += spikes * smoothstep(0.1, 0.4, consume);
    // Contrast curve: harden as progress advances
    shadow = pow(shadow, mix(2.0, 0.55, uScrollProgress));
    shadow = clamp(shadow, 0.0, 1.0);

    // ── Searing light repulsor — burns through the void ──
    float light = searingLight(uv, uMouse, uLightPulse);
    // Hard subtract: light *burns* shadow away
    shadow = max(0.0, shadow - light * 0.98);

    // ── Pulse burst ring ──
    if (uLightPulse > 0.01) {
      vec2 pulseCenter = vec2(uMouse.x, 1.0 - uMouse.y);
      float pulseDist = length(uv - pulseCenter);
      float pulseR = 0.12 + uLightPulse * 0.35;
      // Hard ring
      float ring = smoothstep(pulseR * 1.3, pulseR * 0.9, pulseDist);
      ring *= smoothstep(pulseR * 0.4, pulseR * 0.9, pulseDist);
      shadow = max(0.0, shadow - ring * uLightPulse * 1.5);
    }

    // ── Velocity edge shimmer ──
    float shimmer = vel * 0.25 * snoise(vec3(p * 12.0, t * 4.0));
    shadow += shimmer * consume;
    shadow = clamp(shadow, 0.0, 1.0);

    // Master visibility
    shadow *= uActive;

    // ── Colour: ABSOLUTE BLACK ──
    // Edge: pure void. Core: barely perceptible violet.
    vec3 edgeBlack = vec3(0.000, 0.000, 0.002);
    vec3 coreBlack = vec3(0.020, 0.015, 0.030);
    float coreBlend = smoothstep(0.9, 0.0, length(uv - 0.5)) * (1.0 - uScrollProgress);
    vec3 tint = mix(edgeBlack, coreBlack, coreBlend);

    // Light adds searing gold-white at cursor
    vec3 lightColor = vec3(1.0, 0.92, 0.78);
    float lightMask = smoothstep(0.0, 0.20, light);
    tint = mix(tint, lightColor, lightMask * 0.10 * uActive);

    gl_FragColor = vec4(tint, shadow);
  }
`;
