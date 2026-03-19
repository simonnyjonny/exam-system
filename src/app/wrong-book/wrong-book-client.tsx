'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

interface WrongQuestion {
  id: string;
  subjectName: string;
  questionType: string;
  questionStem: string;
  wrongCount: number;
  lastWrongAt: string;
}

interface WrongBookClientProps {
  wrongQuestions: WrongQuestion[];
}

export function WrongBookClient({ wrongQuestions }: WrongBookClientProps) {
  const { t } = useBilingual();
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);

  const filteredQuestions = subjectFilter
    ? wrongQuestions.filter((q) => q.subjectName === subjectFilter)
    : wrongQuestions;

  const subjectNames = [...new Set(wrongQuestions.map((q) => q.subjectName))];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('错题本', 'Wrong Book')}</h1>
          <nav className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">{t('控制台', 'Dashboard')}</Link>
            <Link href="/papers" className="text-slate-600 hover:text-slate-900">{t('试卷', 'Papers')}</Link>
            <Link href="/wrong-book" className="text-slate-900 font-medium">{t('错题本', 'Wrong Book')}</Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('复习您的错题', 'Review Your Mistakes')}</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSubjectFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm ${
                !subjectFilter ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t('全部', 'All')} ({wrongQuestions.length})
            </button>
            {subjectNames.map((name: string) => {
              const count = wrongQuestions.filter((q) => q.subjectName === name).length;
              return (
                <button
                  key={name}
                  onClick={() => setSubjectFilter(name)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    subjectFilter === name ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {name} ({count})
                </button>
              );
            })}
          </div>
        </div>
        
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">{t('暂无错题', 'No Wrong Questions')}</h3>
            <p className="text-slate-600">{t('太棒了！您还没有错题记录。', 'Great job! You have no wrong question records.')}</p>
            <Link href="/papers" className="inline-block mt-4 text-slate-900 hover:underline">
              {t('参加考试', 'Take Exam')} →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((wq) => (
              <div key={wq.id} className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm text-slate-500">{wq.subjectName}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {wq.questionType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{t('错误', 'Wrong')} {wq.wrongCount} {t('次', 'times')}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">{t('错误', 'Wrong')}</span>
                  </div>
                </div>
                <h3 className="font-medium text-slate-900 mb-4">{wq.questionStem}</h3>
                <div className="text-xs text-slate-400">
                  {t('上次错误', 'Last wrong')}: {new Date(wq.lastWrongAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
