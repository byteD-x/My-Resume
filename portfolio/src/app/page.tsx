'use client';

import { useState, useCallback } from 'react';
import { portfolioData as initialData } from '@/data';
import { PortfolioData, HeroData, VibeCodingData } from '@/types';
import Navbar from '@/components/Navbar';
import Hero from '../components/Hero';
import HighlightDeck from '@/components/HighlightDeck';
import ExperienceFlow from '@/components/ExperienceFlow';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';
import ExportButton from '@/components/ExportButton';
import FloatingResumeButton from '@/components/FloatingResumeButton';
import EditableText from '@/components/EditableText';

export default function Home() {
  const [data, setData] = useState<PortfolioData>(initialData);

  // Hero Update
  const handleHeroUpdate = useCallback((field: keyof HeroData, value: string) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  }, []);

  // About Update
  const handleAboutUpdate = useCallback((value: string) => {
    setData(prev => ({ ...prev, about: value }));
  }, []);

  // Timeline Update
  const handleTimelineUpdate = useCallback((index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const handleTimelineDetailUpdate = useCallback((index: number, detailIndex: number, value: string) => {
    setData(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index
          ? { ...item, details: item.details.map((d, di) => di === detailIndex ? value : d) }
          : item
      )
    }));
  }, []);

  // Projects Update
  const handleProjectUpdate = useCallback((index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const handleProjectDetailUpdate = useCallback((index: number, detailIndex: number, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
        i === index
          ? { ...item, details: item.details.map((d, di) => di === detailIndex ? value : d) }
          : item
      )
    }));
  }, []);

  // VibeCoding Update
  const handleVibeCodingUpdate = useCallback((field: keyof VibeCodingData, value: string) => {
    setData(prev => ({
      ...prev,
      vibeCoding: { ...prev.vibeCoding, [field]: value }
    }));
  }, []);

  // Get current data for export
  const getData = useCallback(() => data, [data]);

  return (
    <main className="min-h-screen relative overflow-hidden">

      <Navbar heroData={data.hero} contactData={data.contact} />

      <Hero data={data.hero} onUpdate={handleHeroUpdate} />

      <div id="impact">
        <HighlightDeck />
      </div>

      {/* About Section */}
      <section className="container-padding py-12">
        <div className="max-w-4xl mx-auto text-center glass-panel p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-bold mb-4 text-white">About Me</h2>
          <div className="text-gray-400 leading-relaxed text-lg">
            <EditableText
              id="about"
              value={data.about}
              onChange={(_, val) => handleAboutUpdate(val)}
              as="div"
              multiline
            />
          </div>
        </div>
      </section>

      <ExperienceFlow
        timeline={data.timeline}
        projects={data.projects}
        onUpdateTimeline={handleTimelineUpdate}
        onUpdateTimelineDetail={handleTimelineDetailUpdate}
        onUpdateProject={handleProjectUpdate}
        onUpdateProjectDetail={handleProjectDetailUpdate}
      />

      <TechStack
        skills={data.skills}
        vibeCoding={data.vibeCoding}
        onUpdateVibeCoding={handleVibeCodingUpdate}
      />

      <Contact contactData={data.contact} heroData={data.hero} />

      <ExportButton getData={getData} />
      <FloatingResumeButton />
    </main>
  );
}
