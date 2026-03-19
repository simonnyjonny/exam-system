'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPaperAction, updatePaperAction, fetchQuestionsForPaper, fetchPaperQuestionsWithDetails, type ActionResult } from './actions';
import type { Subject } from '@prisma/client';
import type { PaperStatus } from '@/types/paper';
import { useBilingual } from '@/contexts/BilingualContext';

interface QuestionOption {
  id: string;
  stem: string;
  type: string;
  difficulty: string;
}

interface SelectedQuestion {
  questionId: string;
  score: number;
  stem: string;
  type: string;
  difficulty: string;
  scoreInputValue: string;
}

interface PaperFormProps {
  subjects: Subject[];
  paperId?: string;
  initialData?: {
    title: string;
    subjectId: string;
    description: string;
    durationMinutes: number;
    passingScore: number;
    status: PaperStatus;
  };
  submitLabel?: string;
}

interface FormErrors {
  [key: string]: string;
}

export function PaperForm({ subjects, paperId, initialData, submitLabel = 'Create Paper' }: PaperFormProps) {
  const { t } = useBilingual();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const [title, setTitle] = useState(initialData?.title || '');
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes || 90);
  const [passingScore, setPassingScore] = useState(initialData?.passingScore || 60);
  const [status, setStatus] = useState<PaperStatus>(initialData?.status || 'DRAFT');

  const [availableQuestions, setAvailableQuestions] = useState<QuestionOption[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const totalScore = selectedQuestions.reduce((sum, q) => sum + (q.score || 0), 0);
  const passingScoreWarning = passingScore > totalScore && selectedQuestions.length > 0;

  useEffect(() => {
    if (subjectId) {
      loadQuestions();
    }
  }, [subjectId]);

  useEffect(() => {
    if (paperId) {
      loadExistingQuestions();
    }
  }, [paperId]);

  const loadQuestions = async () => {
    setLoadingQuestions(true);
    const questions = await fetchQuestionsForPaper(subjectId || undefined, paperId);
    setAvailableQuestions(questions);
    setLoadingQuestions(false);
  };

  const loadExistingQuestions = async () => {
    if (!paperId) return;
    setLoadingQuestions(true);
    const existing = await fetchPaperQuestionsWithDetails(paperId);
    setSelectedQuestions(existing.map((q: { questionId: string; score: number; questionStem: string; questionType: string; difficulty: string }) => ({
      questionId: q.questionId,
      score: q.score,
      stem: q.questionStem,
      type: q.questionType,
      difficulty: q.difficulty,
      scoreInputValue: String(q.score),
    })));
    const questions = await fetchQuestionsForPaper(subjectId || undefined, paperId);
    setAvailableQuestions(questions);
    setLoadingQuestions(false);
  };

  const handleSubjectChange = (newSubjectId: string) => {
    if (selectedQuestions.length > 0) {
      if (!confirm(t('更改科目将清除所有已选题目。是否继续？', 'Changing the subject will clear all selected questions. Continue?'))) {
        return;
      }
      setSelectedQuestions([]);
    }
    setSubjectId(newSubjectId);
  };

  const addQuestion = (question: QuestionOption) => {
    const newQuestion: SelectedQuestion = {
      questionId: question.id,
      score: 5,
      stem: question.stem,
      type: question.type,
      difficulty: question.difficulty,
      scoreInputValue: '5',
    };
    setSelectedQuestions([...selectedQuestions, newQuestion]);
    setAvailableQuestions(availableQuestions.filter(q => q.id !== question.id));
  };

  const removeQuestion = (questionId: string) => {
    const question = selectedQuestions.find(q => q.questionId === questionId);
    if (question) {
      setAvailableQuestions([...availableQuestions, {
        id: question.questionId,
        stem: question.stem,
        type: question.type,
        difficulty: question.difficulty,
      }]);
    }
    setSelectedQuestions(selectedQuestions.filter(q => q.questionId !== questionId));
  };

  const updateQuestionScore = (questionId: string, score: number) => {
    if (isNaN(score) || score < 1) score = 1;
    if (score > 100) score = 100;
    setSelectedQuestions(selectedQuestions.map(q =>
      q.questionId === questionId ? { ...q, score } : q
    ));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...selectedQuestions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setSelectedQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrors({});

    const questions = selectedQuestions.map((q, index) => ({
      questionId: q.questionId,
      score: q.score,
      sortOrder: index,
    }));

    const payload = {
      title,
      subjectId,
      description: description || undefined,
      durationMinutes,
      passingScore,
      status,
      questions,
    };

    let result;
    if (paperId) {
      result = await updatePaperAction(paperId, payload);
    } else {
      result = await createPaperAction(payload);
    }

    if (result.success) {
      setSuccessMessage(paperId ? t('试卷更新成功！', 'Paper updated successfully!') : t('试卷创建成功！', 'Paper created successfully!'));
      setTimeout(() => {
        router.push('/admin/papers');
        router.refresh();
      }, 500);
    } else if (result.errors) {
      setIsSubmitting(false);
      const errorMap: FormErrors = {};
      result.errors.forEach((err: { field: string; message: string }) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
    } else {
      setIsSubmitting(false);
      setErrors({ submit: result.error || t('保存失败', 'Failed to save paper') });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
          {successMessage}
        </div>
      )}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('标题', 'Title')} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder={t('输入试卷标题', 'Enter paper title')}
            required
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('科目', 'Subject')} *
          </label>
          <select
            value={subjectId}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          >
            <option value="">{t('选择科目', 'Select Subject')}</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.subjectId && <p className="text-red-500 text-xs mt-1">{errors.subjectId}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('描述', 'Description')}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder={t('输入试卷描述（可选）', 'Enter paper description (optional)')}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('时长（分钟）', 'Duration (minutes)')} *
          </label>
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value={30}>30 {t('分钟', 'minutes')}</option>
            <option value={60}>60 {t('分钟', 'minutes')}</option>
            <option value={90}>90 {t('分钟', 'minutes')}</option>
            <option value={120}>120 {t('分钟', 'minutes')}</option>
            <option value={180}>180 {t('分钟', 'minutes')}</option>
          </select>
          {errors.durationMinutes && <p className="text-red-500 text-xs mt-1">{errors.durationMinutes}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('及格分数（%）', 'Passing Score (%)')} *
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={passingScore}
            onChange={(e) => setPassingScore(parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${passingScoreWarning ? 'border-orange-300 bg-orange-50' : 'border-slate-300'}`}
          />
          {passingScoreWarning && (
            <p className="text-orange-600 text-xs mt-1">{t('警告：及格分数超过总分', 'Warning: Passing score exceeds total score')} ({totalScore} {t('分', 'points')})</p>
          )}
          {errors.passingScore && <p className="text-red-500 text-xs mt-1">{errors.passingScore}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('状态', 'Status')} *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as PaperStatus)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="DRAFT">{t('草稿', 'Draft')}</option>
            <option value="PUBLISHED">{t('已发布', 'Published')}</option>
            <option value="ARCHIVED">{t('已归档', 'Archived')}</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-slate-900">{t('题目', 'Questions')}</h3>
          <div className="text-sm text-slate-600">
            {t('总分', 'Total Score')}: <span className="font-bold">{totalScore}</span> {t('分', 'points')}
            <span className="ml-4">{t('题目数', 'Questions')}: <span className="font-bold">{selectedQuestions.length}</span></span>
          </div>
        </div>

        {errors.questions && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
            {errors.questions}
          </div>
        )}

        {selectedQuestions.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center text-slate-500">
            {t('尚未添加题目。从下方题库中添加题目。', 'No questions added yet. Add questions from the bank below.')}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-4">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-600 w-16">{t('顺序', 'Order')}</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-600">{t('题目', 'Question')}</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-600 w-24">{t('类型', 'Type')}</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-600 w-24">{t('分值', 'Score')}</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-slate-600 w-20">{t('操作', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedQuestions.map((q, index) => (
                  <tr key={q.questionId}>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, 'up')}
                          disabled={index === 0}
                          className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(index, 'down')}
                          disabled={index === selectedQuestions.length - 1}
                          className="text-slate-400 hover:text-slate-600 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-900 max-w-md truncate">
                      {q.stem}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-600">{q.type}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={q.scoreInputValue}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setSelectedQuestions(selectedQuestions.map(sq =>
                            sq.questionId === q.questionId ? { ...sq, scoreInputValue: val } : sq
                          ));
                        }}
                        onBlur={() => {
                          const val = parseInt(q.scoreInputValue) || 5;
                          updateQuestionScore(q.questionId, val);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = parseInt(q.scoreInputValue) || 5;
                            updateQuestionScore(q.questionId, val);
                          }
                        }}
                        className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.questionId)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {t('移除', 'Remove')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subjectId && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">{t('从题库添加题目', 'Add Questions from Bank')}</h4>
            {loadingQuestions ? (
              <div className="text-slate-500 text-sm">{t('加载中...', 'Loading questions...')}</div>
            ) : availableQuestions.length === 0 ? (
              <div className="text-slate-500 text-sm">{t('该科目下没有更多可用题目', 'No more questions available in this subject')}</div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                {availableQuestions.map(q => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between px-4 py-2 border-b border-slate-100 hover:bg-slate-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 truncate">{q.stem}</p>
                      <p className="text-xs text-slate-500">{q.type} • {q.difficulty}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addQuestion(q)}
                      className="ml-2 px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                    >
                      {t('添加', 'Add')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? t('保存中...', 'Saving...') : submitLabel}
        </button>
        <Link
          href="/admin/papers"
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
        >
          {t('取消', 'Cancel')}
        </Link>
      </div>
    </form>
  );
}
