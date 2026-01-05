'use client';

import dynamic from 'next/dynamic';
import { useEditableContent } from '@/lib/useEditableContent';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HighlightDeck from '@/components/HighlightDeck';
import Services from '@/components/Services';
import { ProjectList } from '@/components/ProjectList';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';
import EditorToolbar from '@/components/EditorToolbar';
import Footer from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';

// Dynamic import for Timeline - deferred loading as it's below the fold
const Timeline = dynamic(
  () => import('@/components/Timeline/TimelineNew').then(mod => ({ default: mod.Timeline })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl" />
        ))}
      </div>
    )
  }
);

export default function Home() {
  const {
    data,
    isEditorEnabled,
    isEditing,
    isDirty,
    lastSaved,
    setIsEditing,
    saveNow,
    exportJSON,
    importJSON,
    resetToDefault,
  } = useEditableContent();

  return (
    <main className="min-h-screen relative bg-slate-50/30">
      <Navbar heroData={data.hero} contactData={data.contact} />
      <ScrollProgressBar />

      <Hero
        data={data.hero}
        contactData={data.contact}
        isEditorActive={isEditing}
      />

      <Section id="impact" className="scroll-mt-20">
        <Container>
          <HighlightDeck
            items={data.impact}
            timeline={data.timeline}
            onItemClick={(linkedId) => {
              const element = document.getElementById(linkedId);
              if (element) {
                // Scroll with offset
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });

                // Optional: Trigger a highlight animation in Timeline (if implementing that prop)
                // For now, smooth scroll is the MVP.
              }
            }}
          />
        </Container>
      </Section>

      <Services services={data.services} />

      <Section id="experience" className="scroll-mt-20 bg-white">
        <Container>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">职业履历</h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              从独立开发到企业级项目交付的完整路径。
            </p>
          </div>
          <Timeline
            items={data.timeline}
            isEditorActive={isEditing}
          />
        </Container>
      </Section>

      <Section id="projects" className="scroll-mt-20 bg-slate-50">
        <Container>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">项目经历</h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              个人开源项目 / 创业项目 / 实验性产品。
            </p>
          </div>
          <ProjectList items={data.projects} />
        </Container>
      </Section>

      <TechStack
        skills={data.skills}
        vibeCoding={data.vibeCoding}
      />

      <Contact
        contactData={data.contact}
      />

      <Footer
        name={data.hero.name}
        githubUrl={data.contact.github}
      />

      {/* Magic Toggle (Demo Mode) */}
      {!isEditorEnabled && (
        <button
          onClick={useEditableContent().toggleDemoMode}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-slate-900 text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
          title="开启演示模式"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:rotate-12 transition-transform"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
      )}

      {/* Editor Toolbar */}
      {isEditorEnabled && (
        <EditorToolbar
          isEditing={isEditing}
          isDirty={isDirty}
          lastSaved={lastSaved}
          onToggleEdit={setIsEditing}
          onSave={saveNow}
          onExport={exportJSON}
          onImport={importJSON}
          onReset={resetToDefault}
        />
      )}
    </main>
  );
}
