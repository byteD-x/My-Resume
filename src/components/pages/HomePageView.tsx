import ImmersiveBackdrop from "@/components/ImmersiveBackdrop";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { CapabilitySummary } from "@/components/home/CapabilitySummary";
import { HomeDeferredSectionsShell } from "@/components/home/HomeDeferredSectionsShell";
import { HomeEvidenceStrip } from "@/components/home/HomeEvidenceStrip";
import { HomePageRuntimeShell } from "@/components/home/HomePageRuntimeShell";
import { HomeSupplementalSectionsShell } from "@/components/home/HomeSupplementalSectionsShell";
import { StructuredDataScript } from "@/components/StructuredDataScript";
import { siteConfig } from "@/config/site";
import { getHomepageData } from "@/lib/home-data";
import { getHomePageStructuredData } from "@/lib/page-metadata";
import type { Locale } from "@/lib/locale";

interface HomePageViewProps {
  locale: Locale;
}

export function HomePageView({ locale }: HomePageViewProps) {
  const data = getHomepageData(locale);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <StructuredDataScript data={getHomePageStructuredData(locale)} />
      <div className="page-grid-bg page-grid-fade pointer-events-none absolute inset-0 z-0 opacity-80" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[-8rem] top-[12rem] hidden h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(191,219,254,0.16),transparent_72%)] blur-3xl md:block" />
        <div className="absolute right-[-5rem] top-[38rem] hidden h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(219,234,254,0.18),transparent_74%)] blur-3xl lg:block" />
      </div>

      <ImmersiveBackdrop />
      <HomePageRuntimeShell
        resumeOwnerName={data.hero.name}
        resumeOwnerTitle={data.hero.title}
      />
      <Navbar heroData={data.hero} contactData={data.contact} />
      <Hero data={data.hero} proofItems={data.heroProofItems} locale={locale} />
      <HomeEvidenceStrip items={data.evidenceStripItems} />

      <HomeDeferredSectionsShell />

      <MotionWrapper delay={0.04} duration={0.52} amount={0.12}>
        <div
          id="featured-projects"
          className="theme-grid-section defer-section-render relative z-10 scroll-mt-24"
        >
          <FeaturedProjects items={data.homepageFeaturedProjects} locale={locale} />
        </div>
      </MotionWrapper>

      <MotionWrapper delay={0.06} duration={0.52} amount={0.12}>
        <div
          id="capability-summary"
          className="theme-grid-section defer-section-render relative z-10 scroll-mt-24"
        >
          <CapabilitySummary
            bullets={data.hero.bullets}
            skills={data.skills}
            services={data.services}
            locale={locale}
          />
        </div>
      </MotionWrapper>

      <HomeSupplementalSectionsShell />

      <MotionWrapper delay={0.16} duration={0.58} amount={0.12}>
        <div className="relative z-10">
          <Footer
            name={data.hero.name}
            title={data.hero.title}
            availability={data.hero.location}
            email={data.contact.email}
            githubUrl={data.contact.github}
            websiteLinks={data.contact.websiteLinks}
            icpRecord={siteConfig.icpRecord}
            icpRecordUrl={siteConfig.icpRecordUrl}
            locale={locale}
          />
        </div>
      </MotionWrapper>
    </main>
  );
}
