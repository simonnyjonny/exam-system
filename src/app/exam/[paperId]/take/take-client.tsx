'use client';

import Link from 'next/link';
import { ExamTakingClient } from './exam-taking-client';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

interface ExamTakeClientProps {
  paperId: string;
  attemptId: string;
  accessError?: string;
}

export function ExamTakeClient({ paperId, attemptId, accessError }: ExamTakeClientProps) {
  const { t } = useBilingual();

  if (accessError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{accessError}</p>
          <Link href="/papers" className="text-slate-900 hover:underline">
            {t('返回试卷', 'Back to Papers')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/papers" className="text-slate-600 hover:text-slate-900 text-sm">
              ← {t('返回', 'Back')}
            </Link>
            <h1 className="text-lg font-semibold text-slate-900">{t('考试进行中', 'Exam in Progress')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              {t('考试ID', 'Exam ID')}: <span className="font-mono text-xs">{attemptId.slice(0, 8)}</span>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <ExamTakingClient paperId={paperId} attemptId={attemptId} />
      </main>
    </div>
  );
}
