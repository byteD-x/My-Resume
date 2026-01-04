import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "杜旭嘉 - 全栈工程师 | AI 原生开发者",
  description: "专注于后端架构与 AI 应用开发的全栈工程师。擅长 Vibe Coding，以 AI 为核心驱动力快速交付跨技术栈的高质量产品。",
  keywords: ["杜旭嘉", "全栈工程师", "后端开发", "AI开发", "Vibe Coding", "Java", "Python", "Spring Boot"],
  authors: [{ name: "杜旭嘉" }],
  openGraph: {
    title: "杜旭嘉 - 全栈工程师 | AI 原生开发者",
    description: "专注于后端架构与 AI 应用开发的全栈工程师",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
