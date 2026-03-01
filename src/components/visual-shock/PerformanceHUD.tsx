"use client";

interface PerformanceHUDProps {
  visible: boolean;
  fps: number;
  frameTime: number;
  drawCalls: number;
  particleCount: number;
  webglSupport: string;
  cameraMode: string;
  onExport: () => void;
}

export function PerformanceHUD({
  visible,
  fps,
  frameTime,
  drawCalls,
  particleCount,
  webglSupport,
  cameraMode,
  onExport,
}: PerformanceHUDProps) {
  if (!visible) return null;

  return (
    <aside className="pointer-events-auto fixed top-4 right-4 z-[80] w-64 rounded-xl border border-slate-300/70 bg-white/90 p-3 text-xs shadow-xl backdrop-blur-md">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">
        Performance Monitor
      </h3>
      <dl className="space-y-1 text-slate-700">
        <div className="flex items-center justify-between">
          <dt>FPS</dt>
          <dd
            className={
              fps < 50
                ? "font-semibold text-amber-700"
                : "font-semibold text-emerald-700"
            }
          >
            {fps.toFixed(1)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Frame</dt>
          <dd>{frameTime.toFixed(2)} ms</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Draw Calls</dt>
          <dd>{drawCalls}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Particles</dt>
          <dd>{particleCount}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>WebGL</dt>
          <dd className="uppercase">{webglSupport}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Camera</dt>
          <dd>{cameraMode}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onExport}
        className="mt-3 w-full rounded-lg border border-slate-300 bg-slate-900 px-2 py-1 text-xs font-medium text-white transition hover:bg-slate-700"
      >
        导出性能数据
      </button>
      <p className="mt-2 text-[11px] text-slate-500">
        快捷键: `P` 显示/隐藏, `C` 切换相机, `J` 切换滚轮劫持
      </p>
    </aside>
  );
}
