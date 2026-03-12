import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { defaultPortfolioData } from "@/data";
import { AnalyticsProvider } from "@/lib/AnalyticsProvider";
import { MotionProvider } from "@/lib/MotionProvider";
import { WebVitals } from "@/lib/performance";
import { SkipToContent } from "@/components/SkipToContent";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    template: `%s | ${siteConfig.name} - ${siteConfig.role}`,
    default: `${siteConfig.name} - ${siteConfig.role}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI 应用工程师",
    "RAG",
    "Agent",
    "智能客服",
    "FastAPI",
    "LangGraph",
    "Python",
    "Next.js",
    "Portfolio",
    "Resume",
  ],
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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const softwareProjects = defaultPortfolioData.projects
    .filter((project) => project.link && project.link.includes("github.com"))
    .map((project) => ({
      "@type": "SoftwareSourceCode",
      name: project.name,
      description: project.summary,
      codeRepository: project.link,
      programmingLanguage: project.techTags.join(", "),
      author: {
        "@type": "Person",
        name: siteConfig.name,
      },
      datePublished: project.year,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        jobTitle: siteConfig.role,
        description: siteConfig.description,
        image: `${siteConfig.siteUrl}/og.png`,
        sameAs: ["https://github.com/icefunicu", siteConfig.siteUrl],
        worksFor: {
          "@type": "Organization",
          name: "Open to Opportunities",
        },
      },
      ...softwareProjects,
    ],
  };

  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn(fontHeading.variable, fontBody.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body subpixel-antialiased" suppressHydrationWarning>
        <AnalyticsProvider>
          <MotionProvider>
            <WebVitals />
            <SkipToContent />
            <div id="main-content">{children}</div>
            {modal}
          </MotionProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
