"use client";

/**
 * Skip-to-content 无障碍链接
 * 让键盘用户可以快速跳过导航，直接到达主内容区域
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only transition-all focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[color:var(--brand-ink)] focus:px-4 focus:py-2 focus:font-medium focus:text-[color:var(--text-inverse)] focus:shadow-[var(--shadow-md)] focus:outline-none focus:ring-2 focus:ring-[rgba(37,99,235,0.28)] focus:ring-offset-2"
    >
      跳转到主内容
    </a>
  );
}
