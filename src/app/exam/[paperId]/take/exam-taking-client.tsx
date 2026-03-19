'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitAnswersAction, fetchAttemptWithPaper, fetchQuestionsForExam } from '../../actions';
import type { ExamQuestionForTaking } from '@/types/exam';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

interface ExamTakingProps {
  paperId: string;
  attemptId: string;
}

export function ExamTakingClient({ paperId, attemptId }: ExamTakingProps) {
  const { t } = useBilingual();
  const router = useRouter();
  const [questions, setQuestions] = useState<ExamQuestionForTaking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    async function loadExam() {
      try {
        const [attemptData, questionsData] = await Promise.all([
          fetchAttemptWithPaper(attemptId),
          fetchQuestionsForExam(paperId),
        ]);

        if (!attemptData) {
          router.push('/papers');
          return;
        }

        if (attemptData.status === 'GRADED' || attemptData.status === 'SUBMITTED') {
          router.push(`/exam/result/${attemptId}`);
          return;
        }

        if (questionsData) {
          setQuestions(questionsData);
        }
      } catch (err) {
        setError(t('加载考试失败', 'Failed to load exam'));
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [paperId, attemptId, router, t]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSingleChoice = (questionId: string, option: string) => {
    handleAnswerChange(questionId, option);
  };

  const handleMultipleChoice = (questionId: string, option: string, checked: boolean) => {
    const current = (answers[questionId] as string[]) || [];
    let newAnswers: string[];
    if (checked) {
      const uniqueAnswers = [...new Set([...current, option])];
      newAnswers = uniqueAnswers;
    } else {
      newAnswers = current.filter(o => o !== option);
    }
    handleAnswerChange(questionId, newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting || hasSubmitted) {
      return;
    }
    
    setSubmitting(true);
    setError(null);

    const answersList = questions.map(q => ({
      questionId: q.questionId,
      answer: answers[q.questionId] || '',
    }));

    const emptyCount = answersList.filter(a => !a.answer || (Array.isArray(a.answer) && a.answer.length === 0)).length;
    
    if (emptyCount > 0) {
      if (!confirm(t(`您有 ${emptyCount} 道题未作答。确定要提交吗？`, `You have ${emptyCount} unanswered question(s). Are you sure you want to submit?`))) {
        setSubmitting(false);
        return;
      }
    }

    const result = await submitAnswersAction(attemptId, answersList);

    if (result.success) {
      setHasSubmitted(true);
      router.push(`/exam/result/${attemptId}`);
    } else {
      let errorMsg = result.error || t('提交答案失败', 'Failed to submit answers');
      if (result.errors && result.errors.length > 0) {
        errorMsg = result.errors.map(e => e.message).join(', ');
      }
      setError(errorMsg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">{t('加载中...', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.questionId} className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex gap-2 mb-3">
              <span className="text-sm font-medium text-slate-500">{t('题目', 'Question')} {index + 1}</span>
              <span className="text-sm text-slate-400">({question.score} {t('分', 'pts')})</span>
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {question.type.replace('_', ' ')}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-slate-900 mb-4">{question.stem}</h3>
            
            {question.type === 'SINGLE_CHOICE' && (
              <div className="space-y-2">
                {question.options.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 ${
                      answers[question.questionId] === option ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.questionId}`}
                      value={option}
                      checked={answers[question.questionId] === option}
                      onChange={() => handleSingleChoice(question.questionId, option)}
                      className="w-4 h-4 text-slate-900"
                    />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'MULTIPLE_CHOICE' && (
              <div className="space-y-2">
                {question.options.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 ${
                      ((answers[question.questionId] as string[]) || []).includes(option) ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={((answers[question.questionId] as string[]) || []).includes(option)}
                      onChange={(e) => handleMultipleChoice(question.questionId, option, e.target.checked)}
                      className="w-4 h-4 text-slate-900 rounded"
                    />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
                <p className="text-xs text-slate-500">{t('选择所有正确答案', 'Select all that apply')}</p>
              </div>
            )}

            {question.type === 'TRUE_FALSE' && (
              <div className="flex gap-4">
                {[t('正确', 'True'), t('错误', 'False')].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-slate-50 ${
                      answers[question.questionId] === option ? 'border-slate-900 bg-slate-50' : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.questionId}`}
                      value={option}
                      checked={answers[question.questionId] === option}
                      onChange={() => handleSingleChoice(question.questionId, option)}
                      className="w-4 h-4 text-slate-900"
                    />
                    <span className="text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'FILL_BLANK' && (
              <input
                type="text"
                value={(answers[question.questionId] as string) || ''}
                onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                placeholder={t('在此输入答案...', 'Type your answer here...')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            )}

            {question.type === 'ESSAY' && (
              <textarea
                value={(answers[question.questionId] as string) || ''}
                onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                placeholder={t('在此写下您的答案...', 'Write your answer here...')}
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            )}
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <Link
            href="/papers"
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t('取消', 'Cancel')}
          </Link>
          <button
            type="submit"
            disabled={submitting || hasSubmitted}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? t('提交中...', 'Submitting...') : hasSubmitted ? t('已提交', 'Submitted') : t('提交答案', 'Submit Answers')}
          </button>
        </div>
      </div>
    </form>
  );
}
