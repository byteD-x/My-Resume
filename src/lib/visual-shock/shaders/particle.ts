export const particleVertexShader = `
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;
varying float vDepth;

void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mvPosition.z;
  gl_PointSize = aSize * (300.0 / max(vDepth, 0.1));
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const particleFragmentShader = `
varying vec3 vColor;
varying float vDepth;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  if (dist > 0.5) {
    discard;
  }

  float alpha = smoothstep(0.5, 0.0, dist);
  vec3 glow = vColor * (1.0 + 0.25 / max(vDepth, 1.0));
  gl_FragColor = vec4(glow, alpha);
}
`;
