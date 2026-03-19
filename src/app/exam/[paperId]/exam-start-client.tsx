'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';
import { useEffect, useState } from 'react';
import { fetchPaperForExam, fetchStudentAttempts, startExamAction } from '../actions';
import { useRouter } from 'next/navigation';

interface ExamStartClientProps {
  paperId: string;
  paper: any;
  paperAttempts: any[];
}

export function ExamStartClient({ paperId, paper, paperAttempts }: ExamStartClientProps) {
  const { t } = useBilingual();
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const hasInProgressAttempt = paperAttempts.some((a: any) => a.status === 'IN_PROGRESS');

  async function handleStartExam() {
    setStarting(true);
    const result = await startExamAction(paperId);
    if (result.success && result.data) {
      router.push(`/exam/${paperId}/take?attemptId=${result.data.id}`);
    } else {
      setStarting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('开始考试', 'Start Exam')}</h1>
          <nav className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">{t('控制台', 'Dashboard')}</Link>
            <Link href="/papers" className="text-slate-600 hover:text-slate-900">{t('试卷', 'Papers')}</Link>
            <Link href="/wrong-book" className="text-slate-600 hover:text-slate-900">{t('错题本', 'Wrong Book')}</Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{paper.title}</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">{t('科目', 'Subject')}</span>
              <span className="text-slate-900 font-medium">{paper.subjectName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">{t('题目数', 'Questions')}</span>
              <span className="text-slate-900 font-medium">{paper.questionCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">{t('时长', 'Duration')}</span>
              <span className="text-slate-900 font-medium">{paper.durationMinutes} {t('分钟', 'minutes')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">{t('及格分', 'Passing Score')}</span>
              <span className="text-slate-900 font-medium">{paper.passingScore}%</span>
            </div>
            {paperAttempts.length > 0 && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{t('历史尝试', 'Previous Attempts')}</span>
                <span className="text-slate-900 font-medium">{paperAttempts.length}</span>
              </div>
            )}
          </div>

          {paper.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">{t('描述', 'Description')}</h3>
              <p className="text-slate-600">{paper.description}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">{t('重要说明', 'Important Instructions')}</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• {t('一旦开始，计时器将开始', 'Once you start, the timer will begin')}</li>
              <li>• {t('您必须在时间到期前提交', 'You must submit before the time expires')}</li>
              <li>• {t('提交前可以更改答案', 'You can change your answers before submitting')}</li>
              <li>• {t('提交后无法更改答案', 'After submission, you cannot change your answers')}</li>
              <li>• {t('错题将被记录在错题本中', 'Wrong answers will be recorded in your wrong question book')}</li>
            </ul>
          </div>

          <button
            onClick={handleStartExam}
            disabled={starting}
            className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {starting ? t('开始中...', 'Starting...') : hasInProgressAttempt ? t('继续考试', 'Continue Exam') : t('开始考试', 'Start Exam')}
          </button>

          <Link 
            href="/papers"
            className="block text-center mt-4 text-slate-600 hover:text-slate-900"
          >
            {t('返回试卷', 'Back to Papers')}
          </Link>
        </div>
      </main>
    </div>
  );
}
