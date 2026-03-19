'use client';

import Link from 'next/link';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useBilingual } from '@/contexts/BilingualContext';

interface QuestionResult {
  questionId: string;
  isCorrect: boolean | null;
  score: number | null;
  maxScore: number;
  stem: string;
  type: string;
  studentAnswer: string | string[];
  correctAnswer: string | string[];
}

interface ResultClientProps {
  result: {
    paperTitle: string;
    subjectName: string;
    attemptNo: number;
    totalScore: number;
    passed: boolean;
    passingScore: number;
    paperId: string;
    questionResults: QuestionResult[];
  };
}

export function ResultClient({ result }: ResultClientProps) {
  const { t } = useBilingual();

  const correctCount = result.questionResults.filter(q => q.isCorrect === true).length;
  const incorrectCount = result.questionResults.filter(q => q.isCorrect === false).length;
  const unansweredCount = result.questionResults.filter(q => q.isCorrect === null).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">{t('考试成绩', 'Exam Result')}</h1>
          <nav className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">{t('控制台', 'Dashboard')}</Link>
            <Link href="/papers" className="text-slate-600 hover:text-slate-900">{t('试卷', 'Papers')}</Link>
            <Link href="/wrong-book" className="text-slate-600 hover:text-slate-900">{t('错题本', 'Wrong Book')}</Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{result.paperTitle}</h2>
            <p className="text-slate-600">{t('科目', 'Subject')}: {result.subjectName}</p>
            <p className="text-slate-500 text-sm">{t('第', 'Attempt')} {result.attemptNo} {t('次考试', '')}</p>
          </div>

          <div className={`text-center py-6 mb-6 rounded-lg ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-5xl font-bold mb-2 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
              {result.totalScore}%
            </div>
            <div className={`text-lg font-medium ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
              {result.passed ? t('及格', 'Passed') : t('不及格', 'Failed')}
            </div>
            <div className="text-slate-600 mt-2">
              {t('及格分数', 'Passing Score')}: {result.passingScore}%
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-slate-600">{t('正确', 'Correct')}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
              <div className="text-sm text-slate-600">{t('错误', 'Incorrect')}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-slate-600">{unansweredCount}</div>
              <div className="text-sm text-slate-600">{t('未答', 'Unanswered')}</div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Link
              href="/papers"
              className="flex-1 py-3 text-center border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              {t('返回试卷', 'Back to Papers')}
            </Link>
            {result.passed && (
              <Link
                href={`/exam/${result.paperId}`}
                className="flex-1 py-3 text-center bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                {t('再次考试', 'Retake')}
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">{t('题目回顾', 'Question Review')}</h3>
          </div>
          
          <div className="divide-y divide-slate-200">
            {result.questionResults.map((question: QuestionResult, index: number) => (
              <div key={question.questionId} className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    question.isCorrect === true ? 'bg-green-100 text-green-700' :
                    question.isCorrect === false ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {question.isCorrect === true ? '✓' : question.isCorrect === false ? '✗' : '-'}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{t('第', 'Q')} {index + 1} {t('题', '')}</span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {question.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {question.score ?? 0}/{question.maxScore} {t('分', 'pts')}
                  </span>
                </div>
                
                <h4 className="text-slate-900 mb-4">{question.stem}</h4>
                
                {question.type !== 'ESSAY' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-slate-500 w-24">{t('你的答案', 'Your Answer')}:</span>
                      <span className={
                        question.isCorrect === true ? 'text-green-700 font-medium' :
                        question.isCorrect === false ? 'text-red-700' :
                        'text-slate-700'
                      }>
                        {Array.isArray(question.studentAnswer) 
                          ? question.studentAnswer.join(', ') 
                          : (question.studentAnswer as string) || t('(未作答)', '(No answer)')
                        }
                      </span>
                    </div>
                    
                    {question.isCorrect === false && (
                      <div className="flex gap-2">
                        <span className="text-slate-500 w-24">{t('正确答案', 'Correct Answer')}:</span>
                        <span className="text-green-700 font-medium">
                          {Array.isArray(question.correctAnswer) 
                            ? question.correctAnswer.join(', ') 
                            : (question.correctAnswer as string)
                          }
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {question.type === 'ESSAY' && (
                  <div className="text-sm text-slate-600">
                    <span className="text-slate-500">{t('你的答案', 'Your Answer')}:</span>
                    <div className="mt-1 p-3 bg-slate-50 rounded whitespace-pre-wrap">
                      {(question.studentAnswer as string) || t('(未作答)', '(No answer)')}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{t('简答题需要人工评分', 'Essay questions require manual grading')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
