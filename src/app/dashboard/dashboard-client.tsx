'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';
import { logoutAction } from '@/app/logout/actions';

interface Attempt {
  id: string;
  paperId: string;
  status: string;
  attemptNo: number;
  paper?: {
    title?: string;
  };
}

interface DashboardClientProps {
  papersData: { total: number };
  attempts: Attempt[];
}

export function DashboardClient({ papersData, attempts }: DashboardClientProps) {
  const { t } = useBilingual();

  const completedCount = attempts.filter(a => a.status === 'GRADED').length;
  const inProgressCount = attempts.filter(a => a.status === 'IN_PROGRESS').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('学生控制台', 'Student Dashboard')}</h1>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {t('退出', 'Logout')}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{t('可参加考试', 'Available Exams')}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">{papersData.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{t('已完成', 'Completed')}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">{completedCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{t('进行中', 'In Progress')}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">{inProgressCount}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">{t('快速操作', 'Quick Actions')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/papers" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <h3 className="font-semibold text-slate-900">{t('参加考试', 'Take an Exam')}</h3>
              <p className="text-sm text-slate-500 mt-1">{t('开始或继续考试', 'Start or continue an exam')}</p>
            </Link>
            <Link href="/wrong-book" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
              <h3 className="font-semibold text-slate-900">{t('错题本', 'Wrong Book')}</h3>
              <p className="text-sm text-slate-500 mt-1">{t('复习您的错题', 'Review your mistakes')}</p>
            </Link>
          </div>
        </div>

        {inProgressCount > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('继续考试', 'Continue Exam')}</h2>
            <div className="bg-white rounded-xl border border-yellow-200 overflow-hidden">
              {attempts.filter(a => a.status === 'IN_PROGRESS').map(attempt => (
                <div key={attempt.id} className="p-4 border-b border-yellow-100 last:border-0 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-900">{attempt.paper?.title || 'Exam'}</div>
                    <div className="text-sm text-slate-500">
                      {t(`第 ${attempt.attemptNo} 次尝试`, `Attempt #${attempt.attemptNo}`)}
                    </div>
                  </div>
                  <Link 
                    href={`/exam/${attempt.paperId}`}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    {t('继续', 'Continue')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
