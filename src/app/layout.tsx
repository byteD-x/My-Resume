import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { AnalyticsProvider } from "@/lib/AnalyticsProvider";
import { MotionProvider } from "@/lib/MotionProvider";
import { WebVitals } from "@/lib/performance";
import { SkipToContent } from "@/components/SkipToContent";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    template: `%s | ${siteConfig.name} - ${siteConfig.role}`,
    default: `${siteConfig.name} - ${siteConfig.role}`,
  },
  description: siteConfig.description,
  keywords: ["后端工程师", "全栈开发", "AI工程", "Java", "Spring Boot", "Python", "LLM", "Resume", "Portfolio"],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.role}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: `${siteConfig.name} Portfolio`,
    type: "website",
    locale: "zh_CN",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.role}`,
    description: siteConfig.description,
    images: [siteConfig.ogImagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  // JSON-LD structured data for Person schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    // ... existing content ...
    "worksFor": {
      "@type": "Organization",
      "name": "Open to Opportunities"
    }
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning className={cn(fontHeading.variable, fontBody.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="antialiased font-body"
        suppressHydrationWarning
      >
        <AnalyticsProvider>
          <MotionProvider>
            <WebVitals />
            <SkipToContent />
            <div id="main-content">
              {children}
            </div>
            {modal}
          </MotionProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
