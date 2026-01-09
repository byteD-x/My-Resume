'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';

/**
 * 自定义 404 页面
 * 保持品牌一致性，提供返回首页的快速入口
 */
export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50/30">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-lg mx-auto"
                >
                    {/* 404 图标 */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-4">
                            <Search className="w-12 h-12 text-slate-400" />
                        </div>
                        <h1 className="text-8xl font-bold text-slate-200">404</h1>
                    </motion.div>

                    {/* 错误信息 */}
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        页面未找到
                    </h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        抱歉，您访问的页面不存在或已被移动。
                        <br />
                        请检查 URL 是否正确，或返回首页继续浏览。
                    </p>

                    {/* 操作按钮 */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="btn btn-primary px-6 py-3 inline-flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            返回首页
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="btn btn-secondary px-6 py-3 inline-flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            返回上页
                        </button>
                    </div>

                    {/* 装饰性背景 */}
                    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
                    </div>
                </motion.div>
            </Container>
        </main>
    );
}
