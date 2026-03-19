'use client';

import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useBilingual } from "@/contexts/BilingualContext";

interface StudentsClientProps {
  username: string;
}

export function StudentsClient({ username }: StudentsClientProps) {
  const { t } = useBilingual();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('学生管理', 'Student Management')}</h1>
          <nav className="flex gap-4 items-center">
            <span className="text-sm text-slate-600">{username}</span>
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">{t('概览', 'Overview')}</Link>
            <Link href="/admin/questions" className="text-slate-600 hover:text-slate-900">{t('题目', 'Questions')}</Link>
            <Link href="/admin/papers" className="text-slate-600 hover:text-slate-900">{t('试卷', 'Papers')}</Link>
            <Link href="/admin/students" className="text-slate-900 font-medium">{t('学生', 'Students')}</Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <input
              type="search"
              placeholder={t('搜索学生...', 'Search students...')}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-64"
            />
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800">
            + {t('导入学生', 'Import Students')}
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">{t('用户名', 'Username')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">{t('邮箱', 'Email')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">{t('角色', 'Role')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">{t('状态', 'Status')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">{t('操作', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  {t('暂无数据', 'No data yet')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
