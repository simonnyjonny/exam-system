'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';
import { logoutAction } from '@/app/logout/actions';

interface AdminDashboardClientProps {
  username: string;
}

export function AdminDashboardClient({ username }: AdminDashboardClientProps) {
  const { t } = useBilingual();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('管理后台', 'Admin Dashboard')}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{username}</span>
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
        <div className="grid gap-6 md:grid-cols-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{t('题目总数', 'Total Questions')}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">-</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{t('已发布试卷', 'Published Papers')}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">-</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{t('学生总数', 'Total Students')}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">-</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">{t('今日提交', 'Today\'s Submissions')}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-2">-</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link href="/admin/questions" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900">{t('题目管理', 'Questions')}</h3>
            <p className="text-sm text-slate-500 mt-1">{t('添加、编辑或删除题库中的题目', 'Add, edit or delete questions')}</p>
          </Link>
          <Link href="/admin/papers" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900">{t('试卷管理', 'Papers')}</h3>
            <p className="text-sm text-slate-500 mt-1">{t('创建和发布考试试卷', 'Create and publish exam papers')}</p>
          </Link>
          <Link href="/admin/students" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <h3 className="font-semibold text-slate-900">{t('学生管理', 'Students')}</h3>
            <p className="text-sm text-slate-500 mt-1">{t('查看和管理学生账户', 'View and manage student accounts')}</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
