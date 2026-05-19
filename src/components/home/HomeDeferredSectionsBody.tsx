"use client";

import Contact from "@/components/Contact";
import HighlightDeck from "@/components/HighlightDeck";
import { ProjectList } from "@/components/ProjectList";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import { Timeline } from "@/components/Timeline/TimelineNew";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getHomepageData } from "@/lib/home-data";
import { useLocale, useUiCopy } from "@/lib/LocaleProvider";

export function HomeDeferredSectionsBody() {
  const { locale } = useLocale();
  const copy = useUiCopy();
  const homepageData = getHomepageData(locale);

  return (
    <>
      <Section
        id="experience"
        className="theme-grid-section theme-section-dense relative z-10 scroll-mt-24 border-b section-divider !py-10 sm:!py-12 lg:!py-16"
      >
        <Container>
          <div
            className="theme-section-header experience-section-header scroll-mt-28 !mb-6 sm:!mb-8 lg:!mb-9"
            data-scroll-target="experience"
          >
            <p className="theme-kicker mb-2">
              {copy.sections.experienceKicker}
            </p>
            <h2 className="theme-title mb-2.5 text-3xl font-bold md:text-4xl">
              {copy.sections.experienceTitle}
            </h2>
          </div>
          <Timeline items={homepageData.homepageTimeline} />
        </Container>
      </Section>

      <div
        id="impact"
        className="theme-grid-section defer-section-render relative z-10 scroll-mt-24 border-b section-divider"
      >
        <div className="section-grid-fade pointer-events-none absolute inset-0 opacity-70" />
        <HighlightDeck
          items={homepageData.impact}
          timeline={homepageData.impactTimeline}
        />
      </div>
    </>
  );
}

export function HomeSupplementalSectionsBody() {
  const { locale } = useLocale();
  const copy = useUiCopy();
  const homepageData = getHomepageData(locale);

  return (
    <>
      <Section
        id="projects"
        className="theme-grid-section-strong theme-section-balanced defer-section-render relative z-10 scroll-mt-24"
      >
        <Container>
          <div
            className="theme-section-header scroll-mt-28 !mb-6 sm:!mb-8 lg:!mb-9"
            data-scroll-target="projects"
          >
            <p className="theme-kicker mb-3">{copy.sections.projectsKicker}</p>
            <h2 className="theme-title mb-2.5 text-3xl font-bold md:text-4xl">
              {copy.sections.projectsTitle}
            </h2>
          </div>
          <ProjectList items={homepageData.homepageProjects} />
        </Container>
      </Section>

      <div
        id="skills"
        className="theme-grid-section defer-section-render relative z-10 scroll-mt-24"
      >
        <TechStack
          skills={homepageData.skills}
          techOverview={homepageData.techOverview}
        />
      </div>

      <div
        id="services"
        className="theme-grid-section defer-section-render relative z-10 scroll-mt-24"
      >
        <Services services={homepageData.services} />
      </div>

      <div
        id="contact"
        className="theme-grid-section defer-section-render relative z-10 scroll-mt-24 border-t section-divider"
      >
        <Contact contactData={homepageData.contact} />
      </div>
    </>
  );
}
