import { Container } from "@/components/ui/Container";
import { getDeploymentDefaultLocale } from "@/lib/deployment-locale";
import { getUiCopy } from "@/lib/locale-copy";

/**
 * 全局加载状态页面
 * 在路由切换时显示骨架屏，提升用户体验
 */
export default function Loading() {
  const copy = getUiCopy(getDeploymentDefaultLocale());

  return (
    <div
      className="dark-portfolio min-h-screen bg-[#0c0d10]"
      role="status"
      aria-live="polite"
      aria-label={copy.loadingLabel}
    >
      {/* Navbar 骨架 */}
      <div className="h-16 border-b border-[rgba(241,238,232,0.13)] bg-[rgba(12,13,16,0.92)] backdrop-blur-sm">
        <Container>
          <div className="flex items-center justify-between h-full">
            <div className="h-6 w-24 rounded-full bg-[rgba(0,217,255,0.24)] animate-pulse" />
            <div className="hidden md:flex gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 w-16 rounded-full bg-[rgba(241,238,232,0.13)] animate-pulse"
                />
              ))}
            </div>
            <div className="h-10 w-24 rounded-full bg-[rgba(255,107,53,0.2)] animate-pulse" />
          </div>
        </Container>
      </div>

      {/* Hero 骨架 */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* 状态徽章 */}
              <div className="mx-auto h-6 w-32 rounded-full bg-[rgba(0,217,255,0.2)] animate-pulse" />

            {/* 标题 */}
            <div className="space-y-4">
              <div className="mx-auto h-12 w-64 rounded-2xl bg-[rgba(241,238,232,0.15)] animate-pulse" />
              <div className="mx-auto h-8 w-96 rounded-2xl bg-[rgba(255,107,53,0.14)] animate-pulse" />
            </div>

            {/* 描述 */}
            <div className="space-y-2 max-w-xl mx-auto">
              <div className="h-4 w-full rounded-full bg-[rgba(241,238,232,0.1)] animate-pulse" />
              <div className="mx-auto h-4 w-4/5 rounded-full bg-[rgba(241,238,232,0.1)] animate-pulse" />
            </div>

            {/* 按钮组 */}
            <div className="flex gap-4 justify-center pt-4">
              <div className="h-12 w-32 rounded-full bg-[rgba(255,107,53,0.18)] animate-pulse" />
              <div className="h-12 w-32 rounded-full bg-[rgba(241,238,232,0.1)] animate-pulse" />
            </div>
          </div>
        </Container>
      </section>

      {/* 内容区骨架 */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-[1.5rem] border border-[rgba(241,238,232,0.1)] bg-[rgba(17,20,24,0.9)] animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
