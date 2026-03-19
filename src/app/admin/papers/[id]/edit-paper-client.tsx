'use client';

import Link from 'next/link';
import { PaperForm } from '../paper-form';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

interface EditPaperClientProps {
  paperId: string;
  paper: any;
  subjects: any[];
  notFound?: boolean;
}

export function EditPaperClient({ paperId, paper, subjects, notFound }: EditPaperClientProps) {
  const { t } = useBilingual();

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{t('试卷未找到', 'Paper not found')}</p>
          <Link href="/admin/papers" className="text-slate-900 hover:underline">
            {t('返回试卷列表', 'Back to papers')}
          </Link>
        </div>
      </div>
    );
  }

  const initialData = {
    title: paper.title,
    subjectId: paper.subjectId,
    description: paper.description || '',
    durationMinutes: paper.durationMinutes,
    passingScore: paper.passingScore,
    status: paper.status,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('编辑试卷', 'Edit Paper')}</h1>
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
          <PaperForm 
            subjects={subjects} 
            paperId={paperId}
            initialData={initialData}
            submitLabel={t('保存更改', 'Save Changes')} 
          />
        </div>
      </main>
    </div>
  );
}
