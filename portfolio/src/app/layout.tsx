import type { Metadata } from "next";
import { Archivo, Space_Grotesk, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "杜旭嘉 - Full Stack Engineer & AI Native Dev",
  description: "Senior Full Stack Engineer specializing in AI-native development. Crafting cinematic web experiences with Next.js, Motion, and AI agents.",
  keywords: ["杜旭嘉", "Full Stack", "AI Native", "Next.js", "React", "Design Engineer", "Portfolio"],
  authors: [{ name: "杜旭嘉" }],
  openGraph: {
    title: "杜旭嘉 - Full Stack Engineer",
    description: "Building the future of web with AI and Motion.",
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
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} ${notoSansSC.variable} antialiased selection:bg-zinc-200 selection:text-zinc-900 bg-zinc-50`}
      >
        {children}
      </body>
    </html>
  );
}
