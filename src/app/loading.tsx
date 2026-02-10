import { Container } from '@/components/ui/Container';

/**
 * 全局加载状态页面
 * 在路由切换时显示骨架屏，提升用户体验
 */
export default function Loading() {
    return (
        <div
            className="min-h-screen bg-slate-50/30"
            role="status"
            aria-live="polite"
            aria-label="页面加载中"
        >
            {/* Navbar 骨架 */}
            <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <Container>
                    <div className="flex items-center justify-between h-full">
                        <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="hidden md:flex gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                            ))}
                        </div>
                        <div className="h-10 w-24 bg-slate-200 rounded-full animate-pulse" />
                    </div>
                </Container>
            </div>

            {/* Hero 骨架 */}
            <section className="py-20">
                <Container>
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        {/* 状态徽章 */}
                        <div className="h-6 w-32 bg-slate-200 rounded-full mx-auto animate-pulse" />

                        {/* 标题 */}
                        <div className="space-y-4">
                            <div className="h-12 w-64 bg-slate-200 rounded mx-auto animate-pulse" />
                            <div className="h-8 w-96 bg-slate-200 rounded mx-auto animate-pulse" />
                        </div>

                        {/* 描述 */}
                        <div className="space-y-2 max-w-xl mx-auto">
                            <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                            <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse mx-auto" />
                        </div>

                        {/* 按钮组 */}
                        <div className="flex gap-4 justify-center pt-4">
                            <div className="h-12 w-32 bg-slate-200 rounded-full animate-pulse" />
                            <div className="h-12 w-32 bg-slate-200 rounded-full animate-pulse" />
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
                                className="h-40 bg-slate-200 rounded-xl animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            />
                        ))}
                    </div>
                </Container>
            </section>
        </div>
    );
}
