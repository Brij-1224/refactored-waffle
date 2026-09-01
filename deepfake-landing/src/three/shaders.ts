export const heroVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uGlitch;
uniform float uMobile;
attribute float aNoise;
varying float vPulse;
varying float vThreat;

void main() {
  vec3 p = position;

  float cursorFalloff = smoothstep(1.3, 0.0, distance(p.xy, uMouse));
  p.z += cursorFalloff * (0.18 + 0.24 * uGlitch);

  float glitchWave = sin((p.y * 13.0) + (uTime * 5.5 + aNoise * 6.0));
  p.x += glitchWave * (0.03 + uGlitch * 0.1);
  p.y += cos((p.x * 9.0) - (uTime * 3.2)) * (0.02 + uGlitch * 0.05);

  if (uMobile < 0.5) {
    p.z += sin(uTime * 0.9 + aNoise * 10.0) * 0.04;
  }

  vPulse = 0.5 + 0.5 * sin(uTime * 1.8 + aNoise * 6.0);
  vThreat = smoothstep(0.35, 1.0, uGlitch);

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (uMobile > 0.5 ? 2.1 : 2.9) * (1.6 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`

export const heroFragmentShader = `
precision highp float;
varying float vPulse;
varying float vThreat;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  float alpha = smoothstep(0.5, 0.0, dist);

  vec3 safeColor = vec3(0.06, 0.86, 1.0);
  vec3 threatColor = vec3(1.0, 0.18, 0.28);
  vec3 color = mix(safeColor, threatColor, vThreat);
  color += vPulse * 0.12;

  gl_FragColor = vec4(color, alpha * 0.95);
}
`

export const gridVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const gridFragmentShader = `
precision highp float;
uniform float uTime;
uniform float uMobile;
varying vec2 vUv;

float grid(vec2 uv, float scale) {
  vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
  float line = min(g.x, g.y);
  return 1.0 - min(line, 1.0);
}

void main() {
  float g1 = grid(vUv + vec2(0.0, uTime * 0.008), 28.0);
  float g2 = grid(vUv + vec2(0.08, -uTime * 0.004), 12.0);
  float pulse = 0.5 + 0.5 * sin(uTime * 0.35);

  float intensity = (g1 * 0.25 + g2 * 0.15) * (uMobile > 0.5 ? 0.65 : 1.0);
  vec3 base = vec3(0.01, 0.03, 0.08);
  vec3 neon = vec3(0.07, 0.55, 1.0) * (0.7 + pulse * 0.3);

  gl_FragColor = vec4(base + neon * intensity, 0.65);
}
`
