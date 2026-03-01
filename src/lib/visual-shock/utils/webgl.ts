export type WebGLSupportLevel = "webgl2" | "webgl1" | "none";

export function detectWebGLSupport(): WebGLSupportLevel {
  if (typeof window === "undefined") return "none";

  try {
    const canvas = document.createElement("canvas");
    const webgl2 = canvas.getContext("webgl2");
    if (webgl2) return "webgl2";

    const webgl1 =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (webgl1) return "webgl1";

    return "none";
  } catch {
    return "none";
  }
}

export function isWebGLAvailable(): boolean {
  return detectWebGLSupport() !== "none";
}
