'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { QuestionFilterForm } from './question-filter-form';
import { QuestionList } from './question-list';
import { useBilingual } from '@/contexts/BilingualContext';

interface QuestionsClientProps {
  questions: any[];
  total: number;
  page: number;
  subjects: any[];
  filter: any;
}

export function QuestionsClient({ questions, total, page, subjects, filter }: QuestionsClientProps) {
  const { t } = useBilingual();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('题目管理', 'Question Management')}</h1>
          <nav className="flex gap-4 items-center">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">{t('概览', 'Overview')}</Link>
            <Link href="/admin/questions" className="text-slate-900 font-medium">{t('题目', 'Questions')}</Link>
            <Link href="/admin/papers" className="text-slate-600 hover:text-slate-900">{t('试卷', 'Papers')}</Link>
            <Link href="/admin/students" className="text-slate-600 hover:text-slate-900">{t('学生', 'Students')}</Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <QuestionFilterForm subjects={subjects} />
          <Link 
            href="/admin/questions/new"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
          >
            + {t('添加题目', 'Add Question')}
          </Link>
        </div>
        
        <QuestionList 
          questions={questions} 
          total={total}
          page={page}
          limit={20}
          filter={filter}
        />
      </main>
    </div>
  );
}
