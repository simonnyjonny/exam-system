'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { publishPaperAction, archivePaperAction, deletePaperAction } from './actions';
import type { PaperListItem, PaperStatus } from '@/types/paper';
import type { Subject } from '@prisma/client';
import { PAPER_STATUS_LABELS } from '@/types/paper';
import { useBilingual } from '@/contexts/BilingualContext';

interface PaperFilterState {
  subjectId: string;
  status: string;
  search: string;
  page: number;
}

interface PaperListClientProps {
  initialPapers: PaperListItem[];
  initialTotal: number;
  initialSubjects: Subject[];
  initialFilter: PaperFilterState;
}

function getStatusColor(status: PaperStatus) {
  switch (status) {
    case 'DRAFT':
      return 'bg-slate-100 text-slate-700';
    case 'PUBLISHED':
      return 'bg-green-100 text-green-700';
    case 'ARCHIVED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function buildQueryString(filter: PaperFilterState, overridePage?: number): string {
  const params = new URLSearchParams();
  if (filter.subjectId) params.set('subjectId', filter.subjectId);
  if (filter.status) params.set('status', filter.status);
  if (filter.search) params.set('search', filter.search);
  if (overridePage !== undefined && overridePage > 1) params.set('page', String(overridePage));
  return params.toString();
}

export function PaperListClient({
  initialPapers,
  initialTotal,
  initialSubjects,
  initialFilter,
}: PaperListClientProps) {
  const { t } = useBilingual();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [papers, setPapers] = useState(initialPapers);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  
  const [subjectId, setSubjectId] = useState(initialFilter.subjectId);
  const [status, setStatus] = useState(initialFilter.status);
  const [search, setSearch] = useState(initialFilter.search);

  useEffect(() => {
    setPapers(initialPapers);
    setTotal(initialTotal);
  }, [initialPapers, initialTotal]);

  const handlePublish = async (id: string) => {
    if (!confirm(t('确定要发布这份试卷吗？', 'Are you sure you want to publish this paper?'))) return;
    setLoading(true);
    const result = await publishPaperAction(id);
    setLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || t('发布失败', 'Failed to publish paper'));
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm(t('确定要归档这份试卷吗？', 'Are you sure you want to archive this paper?'))) return;
    setLoading(true);
    const result = await archivePaperAction(id);
    setLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || t('归档失败', 'Failed to archive paper'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('确定要删除这份试卷吗？此操作无法撤销。', 'Are you sure you want to delete this paper? This action cannot be undone.'))) return;
    setLoading(true);
    const result = await deletePaperAction(id);
    setLoading(false);
    if (result.success) {
      setPapers(papers.filter(p => p.id !== id));
      setTotal(Math.max(0, total - 1));
      router.refresh();
    } else {
      alert(result.error || t('删除失败', 'Failed to delete paper'));
    }
  };

  const applyFilters = () => {
    const params = buildQueryString({ subjectId, status, search, page: 1 });
    router.push(`/admin/papers${params ? '?' + params : ''}`);
  };

  const clearFilters = () => {
    setSubjectId('');
    setStatus('');
    setSearch('');
    router.push('/admin/papers');
  };

  const currentPage = parseInt(searchParams.get('page') || '1');
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const hasActiveFilters = subjectId || status || search;

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder={t('搜索试卷...', 'Search papers...')}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-48"
          />
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">{t('全部科目', 'All Subjects')}</option>
            {initialSubjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          >
            <option value="">{t('全部状态', 'All Status')}</option>
            <option value="DRAFT">{t('草稿', 'Draft')}</option>
            <option value="PUBLISHED">{t('已发布', 'Published')}</option>
            <option value="ARCHIVED">{t('已归档', 'Archived')}</option>
          </select>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200"
          >
            {t('筛选', 'Filter')}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700"
            >
              {t('清除', 'Clear')}
            </button>
          )}
        </div>
        <Link
          href="/admin/papers/new"
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
        >
          + {t('创建试卷', 'Create Paper')}
        </Link>
      </div>
      
      {papers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500">{t('暂无试卷', 'No papers found')}</p>
          {hasActiveFilters ? (
            <button onClick={clearFilters} className="mt-4 text-slate-900 hover:underline">
              {t('清除筛选', 'Clear filters')}
            </button>
          ) : (
            <Link href="/admin/papers/new" className="mt-4 inline-block text-slate-900 hover:underline">
              {t('创建第一份试卷', 'Create your first paper')}
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('标题', 'Title')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('科目', 'Subject')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('题目数', 'Questions')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('时长', 'Duration')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('及格分', 'Passing')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('状态', 'Status')}</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('操作', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {papers.map((paper) => (
                <tr key={paper.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-slate-900 font-medium">{paper.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{t('创建者', 'by')} {paper.creatorUsername}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{paper.subjectName}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{paper.questionCount}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{paper.durationMinutes} {t('分钟', 'min')}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{paper.passingScore}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(paper.status)}`}>
                      {PAPER_STATUS_LABELS[paper.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/papers/${paper.id}`}
                        className="text-slate-900 hover:underline text-sm"
                      >
                        {t('编辑', 'Edit')}
                      </Link>
                      {paper.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(paper.id)}
                          className="text-green-600 hover:underline text-sm"
                          disabled={loading}
                        >
                          {t('发布', 'Publish')}
                        </button>
                      )}
                      {paper.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleArchive(paper.id)}
                          className="text-orange-600 hover:underline text-sm"
                          disabled={loading}
                        >
                          {t('归档', 'Archive')}
                        </button>
                      )}
                      {paper.status !== 'PUBLISHED' && (
                        <button
                          onClick={() => handleDelete(paper.id)}
                          className="text-red-600 hover:underline text-sm"
                          disabled={loading}
                        >
                          {t('删除', 'Delete')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/admin/papers?${buildQueryString({ subjectId, status, search, page: currentPage - 1 })}`}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50"
            >
              {t('上一页', 'Previous')}
            </Link>
          )}
          <span className="px-3 py-1 text-sm text-slate-500">
            {t('第', 'Page')} {currentPage} {t('页，共', ' of ')} {totalPages} {t('页', '')}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/admin/papers?${buildQueryString({ subjectId, status, search, page: currentPage + 1 })}`}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50"
            >
              {t('下一页', 'Next')}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
