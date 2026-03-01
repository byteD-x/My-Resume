export const chromaticAberrationVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const chromaticAberrationFragmentShader = `
uniform sampler2D uSceneTexture;
uniform float uStrength;
uniform vec2 uCenter;
varying vec2 vUv;

void main() {
  vec2 delta = vUv - uCenter;
  float distanceFromCenter = length(delta);
  vec2 offset = normalize(delta + vec2(1e-5)) * distanceFromCenter * uStrength;

  float r = texture2D(uSceneTexture, vUv + offset).r;
  float g = texture2D(uSceneTexture, vUv).g;
  float b = texture2D(uSceneTexture, vUv - offset).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`;
