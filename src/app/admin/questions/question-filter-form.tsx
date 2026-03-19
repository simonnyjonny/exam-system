'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import type { Subject } from '@prisma/client';
import { useBilingual } from '@/contexts/BilingualContext';

interface QuestionFilterFormProps {
  subjects: Subject[];
}

export function QuestionFilterForm({ subjects }: QuestionFilterFormProps) {
  const { t } = useBilingual();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [subjectId, setSubjectId] = useState(searchParams.get('subjectId') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (subjectId) params.set('subjectId', subjectId);
    if (type) params.set('type', type);
    if (difficulty) params.set('difficulty', difficulty);
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    params.set('page', '1');
    
    router.push(`/admin/questions?${params.toString()}`);
  }, [router, subjectId, type, difficulty, status, search]);

  const clearFilters = useCallback(() => {
    setSubjectId('');
    setType('');
    setDifficulty('');
    setStatus('');
    setSearch('');
    router.push('/admin/questions');
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <input
        type="text"
        placeholder={t('搜索题目...', 'Search questions...')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm w-48"
      />
      
      <select
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
      >
        <option value="">{t('全部科目', 'All Subjects')}</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
      >
        <option value="">{t('全部类型', 'All Types')}</option>
        <option value="SINGLE_CHOICE">{t('单选题', 'Single Choice')}</option>
        <option value="MULTIPLE_CHOICE">{t('多选题', 'Multiple Choice')}</option>
        <option value="TRUE_FALSE">{t('判断题', 'True/False')}</option>
        <option value="FILL_BLANK">{t('填空题', 'Fill Blank')}</option>
        <option value="ESSAY">{t('简答题', 'Essay')}</option>
      </select>

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
      >
        <option value="">{t('全部难度', 'All Difficulty')}</option>
        <option value="EASY">{t('简单', 'Easy')}</option>
        <option value="MEDIUM">{t('中等', 'Medium')}</option>
        <option value="HARD">{t('困难', 'Hard')}</option>
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
        type="submit"
        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200"
      >
        {t('筛选', 'Filter')}
      </button>
      
      <button
        type="button"
        onClick={clearFilters}
        className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700"
      >
        {t('清除', 'Clear')}
      </button>
    </form>
  );
}
