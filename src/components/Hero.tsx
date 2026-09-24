import { HeroData } from "@/types";
import { Container } from "./ui/Container";
import { HeroStatusBadges } from "./Hero/HeroStatusBadges";
import { HeroBullets } from "./Hero/HeroBullets";
import { HeroCTA } from "./Hero/HeroCTA";
import { HeroProofPanel } from "./Hero/HeroProofPanel";
import type { HeroSpotlightItem } from "@/lib/home-highlights";
import { formatResumeFileName, getResumeDownloadUrl } from "@/lib/resume";
import { getUiCopy } from "@/lib/locale-copy";
import type { Locale } from "@/lib/locale";

interface HeroProps {
  data: HeroData;
  proofItems: HeroSpotlightItem[];
  locale: Locale;
}

function splitHeroTitle(title: string) {
  const match = title.match(/^(.*?)\uFF08(.+)\uFF09$/);

  return {
    mainTitle: match?.[1]?.trim() || title,
    focusTitle: match?.[2]?.trim(),
  };
}

export default function Hero({ data, proofItems, locale }: HeroProps) {
  const copy = getUiCopy(locale);
  const resumeFileName = formatResumeFileName(data.title, data.name, "-", locale);
  const resumeDownloadUrl = getResumeDownloadUrl(resumeFileName, locale);
  const { mainTitle, focusTitle } = splitHeroTitle(data.title);

  return (
    <section className="relative border-b section-divider bg-white pb-8 pt-[4.6rem] sm:pb-10 sm:pt-22 md:pb-14 md:pt-24">
      <Container>
        <div className="grid items-start gap-9 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="flex flex-col items-start lg:col-span-6">
            <div className="mb-3.5 sm:mb-5">
              <HeroStatusBadges location={data.location} locale={locale} />
            </div>

            <h1 className="theme-title mb-2 text-balance text-[3.2rem] font-bold leading-[1.02] sm:mb-3 sm:text-[4.5rem] md:text-[5rem]">
              {data.name}
            </h1>

            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mb-5">
              <h2 className="theme-title text-[1.35rem] font-semibold leading-tight sm:text-[1.65rem] md:text-[1.85rem]">
                {mainTitle}
              </h2>
              {focusTitle ? (
                <span className="theme-copy-subtle text-sm font-medium sm:text-base">
                  {focusTitle}
                </span>
              ) : null}
            </div>

            <p className="theme-copy mb-6 max-w-[38rem] text-[14px] leading-[1.8] sm:mb-7 sm:text-[15px] sm:leading-[1.9] md:mb-8 md:text-[1.02rem] md:leading-[1.9]">
              {data.subtitle}
            </p>

            <div className="mb-6 w-full sm:mb-7">
              <p className="theme-card-kicker mb-3">{copy.hero.valueLine}</p>
              <HeroBullets bullets={data.bullets} />
            </div>

            <HeroCTA
              downloadName={resumeFileName}
              downloadUrl={resumeDownloadUrl}
            />

            <p className="theme-copy-subtle mt-3.5 text-[12px] leading-6 sm:mt-4 sm:text-[13px]">
              {copy.hero.evidenceNote}
            </p>
          </div>

          <div className="relative lg:col-span-6 lg:pt-2">
            <HeroProofPanel items={proofItems} locale={locale} />
          </div>
        </div>
      </Container>
    </section>
  );
}
