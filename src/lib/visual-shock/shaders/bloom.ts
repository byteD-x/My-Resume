export const bloomVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const bloomFragmentShader = `
uniform sampler2D uSceneTexture;
uniform float uThreshold;
uniform float uIntensity;
uniform vec2 uTexelSize;
varying vec2 vUv;

void main() {
  vec3 color = texture2D(uSceneTexture, vUv).rgb;
  float brightness = max(max(color.r, color.g), color.b);
  float mask = smoothstep(uThreshold, 1.0, brightness);

  vec3 blur = vec3(0.0);
  float weightSum = 0.0;

  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      vec2 offset = vec2(float(x), float(y)) * uTexelSize;
      float weight = 1.0 - (length(vec2(float(x), float(y))) / 3.0);
      blur += texture2D(uSceneTexture, vUv + offset).rgb * max(weight, 0.0);
      weightSum += max(weight, 0.0);
    }
  }

  blur /= max(weightSum, 0.0001);
  vec3 bloom = blur * mask * uIntensity;
  gl_FragColor = vec4(color + bloom, 1.0);
}
`;
