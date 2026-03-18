"use client";

import Link from "next/link";
import { m as motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * 自定义 404 页面
 * 保持品牌一致性，提供返回首页的快速入口
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[rgba(255,250,242,0.82)]">
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
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(239,246,255,0.94)]">
              <Search className="h-12 w-12 text-[color:var(--brand-gold)]" />
            </div>
            <h1 className="text-8xl font-bold text-[rgba(37,99,235,0.18)]">404</h1>
          </motion.div>

          {/* 错误信息 */}
          <h2 className="theme-title mb-3 text-2xl font-bold">
            页面被垃圾回收了 (GC)
          </h2>
          <p className="theme-card-muted mb-8 rounded-[1.25rem] p-4 text-left font-mono text-sm leading-relaxed text-[color:var(--text-secondary)]">
            {`> Error: 404 Not Found`}
            <br />
            {`> Reason: Object reference not set to an instance of an object.`}
            <br />
            {`> Solution: Return to safe execution context (Home).`}
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
            <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-sky-300/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-blue-300/10 blur-3xl" />
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
