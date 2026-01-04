'use client';

import { useEditableContent } from '@/lib/useEditableContent';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HighlightDeck from '@/components/HighlightDeck';
import { Timeline } from '@/components/Timeline/TimelineNew';
import { ProjectList } from '@/components/ProjectList';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';
import EditorToolbar from '@/components/EditorToolbar';
import Footer from '@/components/Footer';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

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

      <Hero
        data={data.hero}
        contactData={data.contact}
        isEditorActive={isEditing}
      />

      <Section id="impact" className="scroll-mt-20">
        <Container>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">量化成果</h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              用数据说话，展示核心竞争力的直接证据。
            </p>
          </div>
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
