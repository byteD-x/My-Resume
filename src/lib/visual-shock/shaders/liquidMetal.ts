export const liquidMetalVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const liquidMetalFragmentShader = `
uniform float uTime;
uniform float uDistortionStrength;
uniform vec3 uTint;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;
  float displacement = noise(uv * 8.0 + uTime * 0.7) * uDistortionStrength;
  uv += vec2(cos(uTime + uv.y * 12.0), sin(uTime + uv.x * 12.0)) * displacement;

  float highlight = smoothstep(0.2, 0.95, 1.0 - distance(uv, vec2(0.5)));
  vec3 metal = vec3(0.65, 0.72, 0.8) + highlight * vec3(0.2, 0.22, 0.24);
  gl_FragColor = vec4(mix(metal, uTint, 0.25), 1.0);
}
`;
