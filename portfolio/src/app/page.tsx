'use client';

import { useState, useCallback } from 'react';
import { portfolioData as initialData } from '@/data';
import { PortfolioData, HeroData, VibeCodingData } from '@/types';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Timeline from '@/components/Timeline';
import Skills from '@/components/Skills';
import VibeCoding from '@/components/VibeCoding';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import ExportButton from '@/components/ExportButton';

export default function Home() {
  const [data, setData] = useState<PortfolioData>(initialData);

  // Hero 更新
  const handleHeroUpdate = useCallback((field: keyof HeroData, value: string) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  }, []);

  // About 更新
  const handleAboutUpdate = useCallback((value: string) => {
    setData(prev => ({ ...prev, about: value }));
  }, []);

  // Timeline 更新
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

  // VibeCoding 更新
  const handleVibeCodingUpdate = useCallback((field: keyof VibeCodingData, value: string) => {
    setData(prev => ({
      ...prev,
      vibeCoding: { ...prev.vibeCoding, [field]: value }
    }));
  }, []);

  // Projects 更新
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

  // 获取当前数据用于导出
  const getData = useCallback(() => data, [data]);

  return (
    <main className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Radial Gradients */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/12 via-indigo-500/6 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 via-cyan-500/6 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-sky-500/6 via-fuchsia-500/4 to-transparent rounded-full blur-3xl animate-glow" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <Hero data={data.hero} onUpdate={handleHeroUpdate} />

        <section id="about">
          <About content={data.about} onUpdate={handleAboutUpdate} />
        </section>

        <section id="experience" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-12 text-center">
              经历
            </h2>
            <Timeline
              items={data.timeline}
              onUpdate={handleTimelineUpdate}
              onUpdateDetail={handleTimelineDetailUpdate}
            />
          </div>
        </section>

        <VibeCoding data={data.vibeCoding} onUpdate={handleVibeCodingUpdate} />

        <section id="projects">
          <Projects
            projects={data.projects}
            onUpdate={handleProjectUpdate}
            onUpdateDetail={handleProjectDetailUpdate}
          />
        </section>

        <section id="skills">
          <Skills skills={data.skills} />
        </section>

        <section id="contact">
          <Contact contact={data.contact} />
        </section>

        <ExportButton getData={getData} />
      </div>
    </main>
  );
}
