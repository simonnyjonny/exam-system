'use client';

import Link from 'next/link';
import { PaperForm } from '../paper-form';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

interface NewPaperClientProps {
  subjects: any[];
}

export function NewPaperClient({ subjects }: NewPaperClientProps) {
  const { t } = useBilingual();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('创建试卷', 'Create Paper')}</h1>
          <nav className="flex gap-4 items-center">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">{t('概览', 'Overview')}</Link>
            <Link href="/admin/questions" className="text-slate-600 hover:text-slate-900">{t('题目', 'Questions')}</Link>
            <Link href="/admin/papers" className="text-slate-600 hover:text-slate-900">{t('试卷', 'Papers')}</Link>
            <Link href="/admin/students" className="text-slate-600 hover:text-slate-900">{t('学生', 'Students')}</Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <PaperForm subjects={subjects} submitLabel={t('创建试卷', 'Create Paper')} />
        </div>
      </main>
    </div>
  );
}
