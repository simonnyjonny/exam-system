'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

interface PapersClientProps {
  papers: any[];
  total: number;
  attempts: any[];
  subjects: any[];
  username: string;
}

export function PapersClient({ papers, total, attempts, subjects, username }: PapersClientProps) {
  const { t } = useBilingual();

  const attemptedPaperIds = new Set(attempts.map((a: any) => a.paperId));
  const inProgressAttempts = attempts.filter((a: any) => a.status === 'IN_PROGRESS');
  const completedAttempts = attempts.filter((a: any) => a.status === 'GRADED' || a.status === 'SUBMITTED');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('试卷列表', 'Papers List')}</h1>
          <nav className="flex gap-4 items-center">
            <span className="text-sm text-slate-600">{username}</span>
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">{t('控制台', 'Dashboard')}</Link>
            <Link href="/papers" className="text-slate-900 font-medium">{t('试卷', 'Papers')}</Link>
            <Link href="/wrong-book" className="text-slate-600 hover:text-slate-900">{t('错题本', 'Wrong Book')}</Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <form className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('科目', 'Subject')}</label>
              <select
                name="subjectId"
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm min-w-[200px]"
              >
                <option value="">{t('全部科目', 'All Subjects')}</option>
                {subjects.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('搜索', 'Search')}</label>
              <input
                type="text"
                name="search"
                placeholder={t('搜索试卷...', 'Search papers...')}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm min-w-[250px]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
            >
              {t('搜索', 'Search')}
            </button>
          </form>
        </div>
 
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">{t('可参加的考试', 'Available Exams')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('共', 'Total')} {total} {t('份试卷', 'papers')}</p>
          </div>
          
          {papers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {t('暂无可用试卷', 'No papers available')}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('试卷标题', 'Paper Title')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('科目', 'Subject')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('题目数', 'Questions')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('时长', 'Duration')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('及格分', 'Passing Score')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('操作', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {papers.map((paper: any) => (
                  <tr key={paper.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-slate-900 font-medium">{paper.title}</div>
                      {paper.description && (
                        <div className="text-sm text-slate-500 truncate max-w-xs">{paper.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{paper.subjectName}</td>
                    <td className="px-6 py-4 text-slate-600">{paper.questionCount}</td>
                    <td className="px-6 py-4 text-slate-600">{paper.durationMinutes} {t('分钟', 'min')}</td>
                    <td className="px-6 py-4 text-slate-600">{paper.passingScore}%</td>
                    <td className="px-6 py-4">
                      {inProgressAttempts.some((a: any) => a.paperId === paper.id) ? (
                        <Link 
                          href={`/exam/${paper.id}`}
                          className="text-yellow-700 hover:underline text-sm font-medium"
                        >
                          {t('继续', 'Continue')}
                        </Link>
                      ) : attemptedPaperIds.has(paper.id) ? (
                        <Link 
                          href={`/exam/${paper.id}`}
                          className="text-slate-900 hover:underline text-sm font-medium"
                        >
                          {t('重新考试', 'Retake')}
                        </Link>
                      ) : (
                        <Link 
                          href={`/exam/${paper.id}`}
                          className="text-slate-900 hover:underline text-sm font-medium"
                        >
                          {t('开始考试', 'Start')}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {inProgressAttempts.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-yellow-200 overflow-hidden">
            <div className="p-4 border-b border-yellow-200 bg-yellow-50">
              <h2 className="font-semibold text-yellow-900">{t('进行中的考试', 'In Progress')}</h2>
              <p className="text-sm text-yellow-700">{t('您有正在进行的考试需要完成', 'You have exams in progress')}</p>
            </div>
            <table className="w-full">
              <thead className="bg-yellow-25 border-b border-yellow-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-yellow-800">{t('试卷', 'Paper')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-yellow-800">{t('考试次数', 'Attempt')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-yellow-800">{t('操作', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-100">
                {inProgressAttempts.map((attempt: any) => (
                  <tr key={attempt.id} className="hover:bg-yellow-25">
                    <td className="px-6 py-4 text-slate-900">
                      {attempt.paper?.title || t('试卷', 'Paper')}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{t('第', 'Attempt')} {attempt.attemptNo} {t('次', '')}</td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/exam/${attempt.paperId}/take?attemptId=${attempt.id}`}
                        className="text-yellow-700 hover:text-yellow-900 text-sm font-medium"
                      >
                        {t('继续', 'Continue')} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {completedAttempts.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">{t('历史考试记录', 'History')}</h2>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('试卷', 'Paper')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('考试次数', 'Attempt')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('状态', 'Status')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('分数', 'Score')}</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('操作', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {completedAttempts.slice(0, 5).map((attempt: any) => (
                  <tr key={attempt.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">
                      {attempt.paper?.title || t('试卷', 'Paper')}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{t('第', 'Attempt')} {attempt.attemptNo} {t('次', '')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        attempt.status === 'GRADED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {attempt.status === 'GRADED' ? t('已评分', 'Graded') : t('已提交', 'Submitted')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {attempt.totalScore !== null ? `${attempt.totalScore}%` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {attempt.status === 'GRADED' && (
                        <Link 
                          href={`/exam/result/${attempt.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {t('查看成绩', 'View')}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
