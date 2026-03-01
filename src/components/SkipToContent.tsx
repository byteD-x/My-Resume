"use client";

/**
 * Skip-to-content 无障碍链接
 * 让键盘用户可以快速跳过导航，直接到达主内容区域
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
    >
      跳转到主内容
    </a>
  );
}
