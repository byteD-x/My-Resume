export const holographicVertexShader = `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const holographicFragmentShader = `
uniform float uTime;
uniform vec3 uPrimaryColor;
uniform vec3 uSecondaryColor;
uniform float uScanlineSpeed;
uniform float uRgbSeparation;
uniform float uFresnelPower;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), uFresnelPower);
  float scanline = sin((vUv.y + uTime * uScanlineSpeed) * 140.0) * 0.08;
  float flicker = mix(0.96, 1.04, random(vUv + uTime));

  vec3 baseColor = mix(uPrimaryColor, uSecondaryColor, vUv.y);
  vec3 shifted = vec3(
    baseColor.r + uRgbSeparation * fresnel,
    baseColor.g,
    baseColor.b + uRgbSeparation * scanline
  );

  float alpha = clamp(0.55 + fresnel * 0.45 + scanline, 0.0, 1.0);
  gl_FragColor = vec4(shifted * flicker, alpha);
}
`;
