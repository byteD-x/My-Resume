'use client';

import { useState, useCallback } from 'react';
import { useEditableContent } from '@/lib/useEditableContent';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HighlightDeck from '@/components/HighlightDeck';
import ExperienceFlow from '@/components/ExperienceFlow';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';
import EditorToolbar from '@/components/EditorToolbar';
import FloatingResumeButton from '@/components/FloatingResumeButton';
import Footer from '@/components/Footer';

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

  // Impact → Timeline 高亮状态
  const [highlightedExperienceId, setHighlightedExperienceId] = useState<string | null>(null);

  // 处理 Impact 卡片点击
  const handleImpactClick = useCallback((linkedExperienceId: string) => {
    setHighlightedExperienceId(linkedExperienceId);
  }, []);

  // 清除高亮
  const handleClearHighlight = useCallback(() => {
    setHighlightedExperienceId(null);
  }, []);

  return (
    <main className="min-h-screen relative">
      <Navbar heroData={data.hero} contactData={data.contact} />

      <Hero data={data.hero} isEditorActive={isEditing} />

      <HighlightDeck
        items={data.impact}
        onItemClick={handleImpactClick}
        isEditorActive={isEditing}
      />

      <ExperienceFlow
        timeline={data.timeline}
        projects={data.projects}
        isEditorActive={isEditing}
        highlightedId={highlightedExperienceId}
        onClearHighlight={handleClearHighlight}
      />

      <TechStack
        skills={data.skills}
        vibeCoding={data.vibeCoding}
        isEditorActive={isEditing}
      />

      <Contact
        contactData={data.contact}
        heroData={data.hero}
        isEditorActive={isEditing}
      />

      <Footer
        name={data.hero.name}
        githubUrl={data.contact.github}
      />

      {/* 编辑器工具栏 - 仅在启用编辑功能时显示 */}
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

      <FloatingResumeButton />
    </main>
  );
}
