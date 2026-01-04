import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "杜旭嘉 - 后端/全栈工程师 · AI Native Dev",
  description: "专注后端架构与 AI 应用开发。把系统做快做稳，把 AI 做到可上线。",
  keywords: ["杜旭嘉", "后端工程师", "全栈开发", "AI Native", "Java", "Spring Boot", "性能优化"],
  authors: [{ name: "杜旭嘉" }],
  openGraph: {
    title: "杜旭嘉 - 后端/全栈工程师",
    description: "专注后端架构与 AI 应用开发",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} antialiased`}
        style={{
          fontFamily: "var(--font-ibm), 'IBM Plex Sans SC', system-ui, sans-serif"
        }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
