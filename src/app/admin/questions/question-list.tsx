'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteQuestionAction } from './actions';
import { QUESTION_TYPE_LABELS, QUESTION_DIFFICULTY_LABELS, QUESTION_STATUS_LABELS } from '@/types/question';
import type { QuestionListItem, QuestionFilter } from '@/types/question';
import { useBilingual } from '@/contexts/BilingualContext';

interface QuestionListProps {
  questions: QuestionListItem[];
  total: number;
  page: number;
  limit: number;
  filter: QuestionFilter;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'EASY':
      return 'bg-green-100 text-green-700';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-700';
    case 'HARD':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function getStatusColor(status: string) {
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

function getTypeColor(type: string) {
  switch (type) {
    case 'SINGLE_CHOICE':
      return 'bg-blue-100 text-blue-700';
    case 'MULTIPLE_CHOICE':
      return 'bg-purple-100 text-purple-700';
    case 'TRUE_FALSE':
      return 'bg-orange-100 text-orange-700';
    case 'FILL_BLANK':
      return 'bg-teal-100 text-teal-700';
    case 'ESSAY':
      return 'bg-pink-100 text-pink-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function buildFilterParams(filter: QuestionFilter): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.subjectId) params.set('subjectId', filter.subjectId);
  if (filter.type) params.set('type', filter.type);
  if (filter.difficulty) params.set('difficulty', filter.difficulty);
  if (filter.status) params.set('status', filter.status);
  if (filter.search) params.set('search', filter.search);
  return params;
}

export function QuestionList({ questions, total, page, limit, filter }: QuestionListProps) {
  const { t } = useBilingual();
  const router = useRouter();
  const filterParams = buildFilterParams(filter);
  const queryString = filterParams.toString();
  const baseUrl = `/admin/questions${queryString ? `?${queryString}` : ''}`;

  const handleDelete = async (id: string) => {
    if (!confirm(t('确定要删除这道题目吗？', 'Are you sure you want to delete this question?'))) {
      return;
    }

    const result = await deleteQuestionAction(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || t('删除题目失败', 'Failed to delete question'));
    }
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">{t('暂无题目', 'No questions yet')}</p>
        <Link 
          href="/admin/questions/new"
          className="mt-4 inline-block text-slate-900 hover:underline"
        >
          {t('创建第一道题目', 'Create your first question')}
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('题目', 'Question')}</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('科目', 'Subject')}</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('类型', 'Type')}</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('难度', 'Difficulty')}</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('状态', 'Status')}</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('更新时间', 'Updated')}</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-slate-600">{t('操作', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="text-slate-900 max-w-md truncate">{question.stem}</p>
                  <p className="text-xs text-slate-500 mt-1">{t('创建者', 'Creator')}: {question.creatorUsername}</p>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{question.subjectName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(question.type)}`}>
                    {QUESTION_TYPE_LABELS[question.type]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(question.difficulty)}`}>
                    {QUESTION_DIFFICULTY_LABELS[question.difficulty]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(question.status)}`}>
                    {QUESTION_STATUS_LABELS[question.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {new Date(question.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <Link 
                      href={`/admin/questions/${question.id}`}
                      className="text-slate-900 hover:underline text-sm"
                    >
                      {t('编辑', 'Edit')}
                    </Link>
                    <button 
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      {t('删除', 'Delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`${baseUrl}${queryString ? '&' : '?'}page=${page - 1}`}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50"
            >
              {t('上一页', 'Previous')}
            </Link>
          )}
          <span className="px-3 py-1 text-sm text-slate-500">
            {t('第', 'Page')} {page} {t('页，共', ' of ')} {totalPages} {t('页', ' pages')}
          </span>
          {page < totalPages && (
            <Link
              href={`${baseUrl}${queryString ? '&' : '?'}page=${page + 1}`}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50"
            >
              {t('下一页', 'Next')}
            </Link>
          )}
        </div>
      )}
    </>
  );
}
