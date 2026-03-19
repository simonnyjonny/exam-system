'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createQuestionAction } from './actions';
import type { Subject } from '@prisma/client';
import type { QuestionType, QuestionDifficulty, QuestionStatus } from '@/types/question';
import { useBilingual } from '@/contexts/BilingualContext';

interface QuestionFormProps {
  subjects: Subject[];
  onSuccess?: () => void;
  submitLabel?: string;
}

type FormMode = 'create' | 'edit';

interface FormErrors {
  [key: string]: string;
}

export function QuestionForm({ subjects, onSuccess, submitLabel = 'Create Question' }: QuestionFormProps) {
  const { t } = useBilingual();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [subjectId, setSubjectId] = useState('');
  const [type, setType] = useState<QuestionType>('SINGLE_CHOICE');
  const [stem, setStem] = useState('');
  const [options, setOptions] = useState([{ id: '1', text: '' }, { id: '2', text: '' }, { id: '3', text: '' }, { id: '4', text: '' }]);
  const [correctSingle, setCorrectSingle] = useState<string>('');
  const [correctMultiple, setCorrectMultiple] = useState<string[]>([]);
  const [correctTrueFalse, setCorrectTrueFalse] = useState<boolean | null>(null);
  const [correctFillBlank, setCorrectFillBlank] = useState('');
  const [correctEssay, setCorrectEssay] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>('MEDIUM');
  const [status, setStatus] = useState<QuestionStatus>('DRAFT');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') {
      if (options.length < 2) {
        setOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
      }
    }
    if (type !== 'SINGLE_CHOICE') setCorrectSingle('');
    if (type !== 'MULTIPLE_CHOICE') setCorrectMultiple([]);
  }, [type]);

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleMultipleToggle = (id: string) => {
    if (correctMultiple.includes(id)) {
      setCorrectMultiple(correctMultiple.filter(i => i !== id));
    } else {
      setCorrectMultiple([...correctMultiple, id]);
    }
  };

  const hasSelectedCorrectAnswer = () => {
    if (type === 'SINGLE_CHOICE') return correctSingle !== '';
    if (type === 'MULTIPLE_CHOICE') return correctMultiple.length > 0;
    if (type === 'TRUE_FALSE') return correctTrueFalse !== null;
    if (type === 'FILL_BLANK') return correctFillBlank.trim() !== '';
    if (type === 'ESSAY') return correctEssay.trim() !== '';
    return true;
  };

  const buildAnswer = () => {
    switch (type) {
      case 'SINGLE_CHOICE': {
        const selectedOption = options.find(o => o.id === correctSingle);
        return { single: selectedOption?.text || '' };
      }
      case 'MULTIPLE_CHOICE': {
        const selectedTexts = correctMultiple
          .map(id => options.find(o => o.id === id)?.text)
          .filter(Boolean) as string[];
        return { multiple: selectedTexts };
      }
      case 'TRUE_FALSE':
        return { trueFalse: correctTrueFalse ?? undefined };
      case 'FILL_BLANK':
        return { fillBlank: correctFillBlank };
      case 'ESSAY':
        return { essay: correctEssay };
      default:
        return { single: '' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const answer = buildAnswer();
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const result = await createQuestionAction({
      subjectId,
      type,
      stem,
      options: type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE' ? options : undefined,
      answer,
      analysis: analysis || undefined,
      difficulty,
      tags: tagsArray,
      status,
    });

    setIsSubmitting(false);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/questions');
      }
    } else if (result.errors) {
      const errorMap: FormErrors = {};
      result.errors.forEach((err: { field: string; message: string }) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
    } else {
      setErrors({ submit: result.error || t('创建题目失败', 'Failed to create question') });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('科目', 'Subject')} *
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          >
            <option value="">{t('选择科目', 'Select Subject')}</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
          {errors.subjectId && <p className="text-red-500 text-xs mt-1">{errors.subjectId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('题目类型', 'Question Type')} *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="SINGLE_CHOICE">{t('单选题', 'Single Choice')}</option>
            <option value="MULTIPLE_CHOICE">{t('多选题', 'Multiple Choice')}</option>
            <option value="TRUE_FALSE">{t('判断题', 'True/False')}</option>
            <option value="FILL_BLANK">{t('填空题', 'Fill in Blank')}</option>
            <option value="ESSAY">{t('简答题', 'Essay')}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('题目内容', 'Question Stem')} *
        </label>
        <textarea
          value={stem}
          onChange={(e) => setStem(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder={t('在此输入您的题目...', 'Enter your question here...')}
          required
        />
        {errors.stem && <p className="text-red-500 text-xs mt-1">{errors.stem}</p>}
      </div>

      {(type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE') && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('选项', 'Options')} {(type === 'MULTIPLE_CHOICE' ? '(select all correct)' : '')} *
            {!hasSelectedCorrectAnswer() && (
              <span className="ml-2 text-amber-600 font-normal">({t('未选择正确答案', 'no correct answer selected')})</span>
            )}
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                {type === 'SINGLE_CHOICE' ? (
                  <input
                    type="radio"
                    name="correct"
                    checked={correctSingle === option.id}
                    onChange={() => setCorrectSingle(option.id)}
                    className="w-4 h-4"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={correctMultiple.includes(option.id)}
                    onChange={() => handleMultipleToggle(option.id)}
                    className="w-4 h-4"
                  />
                )}
                <span className="text-sm text-slate-500 w-6">{String.fromCharCode(65 + index)}.</span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder={`${t('选项', 'Option')} ${String.fromCharCode(65 + index)}`}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            ))}
          </div>
          {errors.options && <p className="text-red-500 text-xs mt-1">{errors.options}</p>}
        </div>
      )}

      {type === 'TRUE_FALSE' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('正确答案', 'Correct Answer')} *
            {correctTrueFalse === null && (
              <span className="ml-2 text-amber-600 font-normal">({t('选择一个答案', 'select an answer')})</span>
            )}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="trueFalse"
                checked={correctTrueFalse === true}
                onChange={() => setCorrectTrueFalse(true)}
                className="w-4 h-4"
              />
              <span className="text-sm">{t('正确', 'True')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="trueFalse"
                checked={correctTrueFalse === false}
                onChange={() => setCorrectTrueFalse(false)}
                className="w-4 h-4"
              />
              <span className="text-sm">{t('错误', 'False')}</span>
            </label>
          </div>
          {errors['answer.trueFalse'] && <p className="text-red-500 text-xs mt-1">{errors['answer.trueFalse']}</p>}
        </div>
      )}

      {type === 'FILL_BLANK' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('正确答案', 'Correct Answer')} *
          </label>
          <input
            type="text"
            value={correctFillBlank}
            onChange={(e) => setCorrectFillBlank(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder={t('输入正确答案', 'Enter the correct answer')}
          />
          {errors['answer.fillBlank'] && <p className="text-red-500 text-xs mt-1">{errors['answer.fillBlank']}</p>}
        </div>
      )}

      {type === 'ESSAY' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('参考答案', 'Reference Answer')} *
          </label>
          <textarea
            value={correctEssay}
            onChange={(e) => setCorrectEssay(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder={t('输入参考答案用于评分...', 'Enter the reference/model answer for grading...')}
          />
          {errors['answer.essay'] && <p className="text-red-500 text-xs mt-1">{errors['answer.essay']}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t('解析 / 讲解', 'Analysis / Explanation')}
        </label>
        <textarea
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          placeholder={t('解释正确答案...', 'Explain the correct answer...')}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('难度', 'Difficulty')} *
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="EASY">{t('简单', 'Easy')}</option>
            <option value="MEDIUM">{t('中等', 'Medium')}</option>
            <option value="HARD">{t('困难', 'Hard')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('状态', 'Status')} *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as QuestionStatus)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="DRAFT">{t('草稿', 'Draft')}</option>
            <option value="PUBLISHED">{t('已发布', 'Published')}</option>
            <option value="ARCHIVED">{t('已归档', 'Archived')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('标签', 'Tags')}
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder={t('标签1, 标签2, 标签3', 'tag1, tag2, tag3')}
          />
          <p className="text-xs text-slate-500 mt-1">{t('用逗号分隔', 'Separate with commas')}</p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? t('创建中...', 'Creating...') : submitLabel}
        </button>
        <Link
          href="/admin/questions"
          className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
        >
          {t('取消', 'Cancel')}
        </Link>
      </div>
    </form>
  );
}
