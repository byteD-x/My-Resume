'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useEditableContent } from '@/lib/useEditableContent';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HighlightDeck from '@/components/HighlightDeck';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import Contact from '@/components/Contact';
import EditorToolbar from '@/components/EditorToolbar';
import Footer from '@/components/Footer';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { DarkModeCursorGlow } from '@/components/ui/CursorGlow';
import { clearScrollRestore, readScrollRestore } from '@/lib/scroll-restore';

// ==========================================
// 性能优化：动态导入策略
// ==========================================
// 使用动态导入来分割代码，减少初始加载包大小
// 对首屏以下的组件使用动态导入

// Dynamic import for Services - 位于首屏下方，使用动态导入
const Services = dynamic(() => import('@/components/Services'), {
  loading: () => <div className="h-96 bg-slate-50 animate-pulse rounded-2xl" aria-hidden="true" />,
});

// Dynamic import for ProjectList - 位于首屏下方，使用动态导入
const ProjectList = dynamic(
  () => import('@/components/ProjectList').then(mod => mod.ProjectList),
  {
    loading: () => <div className="h-96 bg-slate-50 rounded-2xl animate-pulse" aria-hidden="true" />,
  }
);

// Dynamic import for TechStack - 位于页面底部，使用动态导入
const TechStack = dynamic(() => import('@/components/TechStack'), {
  loading: () => <div className="h-96 bg-slate-900 rounded-2xl animate-pulse" aria-hidden="true" />,
});

// Dynamic import for Timeline - 延迟加载首屏下方组件，开启 SSR 优化 SEO
const Timeline = dynamic(
  () => import('@/components/Timeline/TimelineNew').then(mod => ({ default: mod.Timeline })),
  {
    ssr: true, // 启用 SSR 以提升 SEO 和首次内容绘制
    loading: () => (
      <div className="animate-pulse space-y-6" role="status" aria-label="加载中">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-36 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl border border-slate-100"
            style={{ animationDelay: `${i * 100}ms` }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">正在加载职业履历...</span>
      </div>
    ),
  },
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
    toggleDemoMode,
  } = useEditableContent();

  useEffect(() => {
    const state = readScrollRestore();
    if (!state || typeof window === 'undefined') return;

    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (state.path && state.path !== currentPath) return;

    const restoreScroll = () => {
      if (typeof state.y === 'number' && Number.isFinite(state.y)) {
        window.scrollTo({ top: state.y, behavior: 'smooth' });
      } else if (state.section) {
        const target = document.getElementById(state.section);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      clearScrollRestore();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(restoreScroll);
    });
  }, []);

  return (
    <main className="min-h-screen relative bg-slate-50/30">
      <Navbar heroData={data.hero} contactData={data.contact} />
      <ScrollProgressBar />
      <DarkModeCursorGlow />

      <Hero
        data={data.hero}
        isEditorActive={isEditing}
      />


      <MotionWrapper delay={0.1}>
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
                }
              }}
            />
          </Container>
        </Section>
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <Services services={data.services} />
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <Section id="experience" className="scroll-mt-20 bg-white/50 backdrop-blur-sm">
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
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <Section id="projects" className="scroll-mt-20 bg-slate-50/50">
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
      </MotionWrapper>

      <MotionWrapper delay={0.2}>
        <TechStack
          skills={data.skills}
          vibeCoding={data.vibeCoding}
        />
      </MotionWrapper>

      <MotionWrapper delay={0.1}>
        <Contact
          contactData={data.contact}
        />
      </MotionWrapper>

      <Footer
        name={data.hero.name}
        githubUrl={data.contact.github}
      />

      {/* Magic Toggle (Demo Mode) */}
      {!isEditorEnabled && (
        <button
          onClick={toggleDemoMode}
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
