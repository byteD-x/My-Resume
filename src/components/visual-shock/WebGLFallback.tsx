"use client";

interface WebGLFallbackProps {
  message?: string;
}

export function WebGLFallback({
  message = "当前环境不支持 WebGL，已切换到静态视觉降级模式。",
}: WebGLFallbackProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      data-testid="webgl-fallback"
    >
      <div className="absolute -top-48 -left-40 h-[36rem] w-[36rem] rounded-full bg-sky-300/20 blur-[120px]" />
      <div className="absolute top-[30%] -right-40 h-[38rem] w-[38rem] rounded-full bg-blue-300/20 blur-[140px]" />
      <div className="absolute bottom-[-12rem] left-[25%] h-[36rem] w-[36rem] rounded-full bg-cyan-300/20 blur-[130px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(2,132,199,0.14),transparent_70%)]" />
      <p className="sr-only">{message}</p>
    </div>
  );
}
