'use server';

import { getSession, type SessionData } from '@/lib/auth/session';
import { requireStudent } from '@/lib/rbac';
import {
  getAvailablePapers,
  getPaperById,
  getPaperWithQuestions,
  createAttempt,
  startAttempt,
  getInProgressAttempt,
  getAttemptById,
  getAttemptWithPaper,
  getAttemptsByStudent,
  saveAnswers,
  submitAttempt,
  gradeAttempt,
  getResult,
} from '@/repositories/exam.repository';
import {
  validateStartExam,
  validateSubmitAnswers,
  hasErrors,
} from '@/lib/validators/exam.validator';
import { serializeStudentAnswer } from '@/lib/grading';
import type { ExamPaper, ExamQuestionWithDetails, ExamQuestionForTaking, ExamAttempt, ExamAttemptWithPaper, ExamResult, ExamFilter } from '@/types/exam';

export interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

async function getStudentSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    throw new Error('FORBIDDEN');
  }
  return session;
}

export async function fetchAvailablePapers(
  filter: ExamFilter = {}
): Promise<{ papers: ExamPaper[]; total: number }> {
  const session = await getStudentSession();
  return getAvailablePapers(session.userId, filter);
}

export async function fetchPaperForExam(paperId: string): Promise<ExamPaper | null> {
  await getStudentSession();
  return getPaperById(paperId);
}

export async function fetchQuestionsForExam(paperId: string): Promise<ExamQuestionForTaking[] | null> {
  const session = await getStudentSession();
  return getPaperWithQuestions(paperId);
}

export interface TakingAccessValidation {
  valid: boolean;
  error?: string;
  redirectTo?: string;
}

export async function validateTakingAccess(
  paperId: string,
  attemptId: string
): Promise<TakingAccessValidation> {
  const session = await getStudentSession();
  
  const attempt = await getAttemptById(attemptId);
  if (!attempt) {
    return { valid: false, error: 'Attempt not found', redirectTo: '/papers' };
  }
  
  if (attempt.studentId !== session.userId) {
    return { valid: false, error: 'Unauthorized', redirectTo: '/papers' };
  }
  
  if (attempt.paperId !== paperId) {
    return { valid: false, error: 'Attempt does not match this exam', redirectTo: '/papers' };
  }
  
  if (attempt.status === 'GRADED' || attempt.status === 'SUBMITTED') {
    return { valid: false, redirectTo: `/exam/result/${attemptId}` };
  }
  
  if (attempt.status !== 'IN_PROGRESS') {
    return { valid: false, error: 'Attempt is not active', redirectTo: '/papers' };
  }
  
  return { valid: true };
}

export async function startExamAction(paperId: string): Promise<ActionResult<ExamAttempt>> {
  let session: SessionData;
  try {
    session = await getStudentSession();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const errors = validateStartExam({ paperId });
  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  try {
    const existingInProgress = await getInProgressAttempt(session.userId, paperId);
    if (existingInProgress) {
      return { success: true, data: existingInProgress };
    }
    
    const paper = await getPaperById(paperId);
    if (!paper) {
      return { success: false, error: 'Paper not found or not available' };
    }

    const attempt = await createAttempt(paperId, session.userId);
    const startedAttempt = await startAttempt(attempt.id);

    return { success: true, data: startedAttempt };
  } catch (error) {
    console.error('Error starting exam:', error);
    return { success: false, error: 'Failed to start exam' };
  }
}

export async function fetchAttempt(attemptId: string): Promise<ExamAttempt | null> {
  const session = await getStudentSession();
  const attempt = await getAttemptById(attemptId);
  
  if (!attempt || attempt.studentId !== session.userId) {
    return null;
  }
  
  return attempt;
}

export async function fetchAttemptWithPaper(attemptId: string) {
  const session = await getStudentSession();
  const attempt = await getAttemptWithPaper(attemptId);
  
  if (!attempt || attempt.studentId !== session.userId) {
    return null;
  }
  
  return attempt;
}

export async function fetchStudentAttempts(): Promise<ExamAttemptWithPaper[]> {
  const session = await getStudentSession();
  return getAttemptsByStudent(session.userId);
}

export async function submitAnswersAction(
  attemptId: string,
  answers: Array<{ questionId: string; answer: string | string[] }>
): Promise<ActionResult<ExamResult>> {
  let session: SessionData;
  try {
    session = await getStudentSession();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  console.log('[SUBMIT] Step 1: Getting attempt for:', attemptId);
  const attempt = await getAttemptById(attemptId);
  if (!attempt) {
    console.log('[SUBMIT] Step 1 FAILED: Attempt not found');
    return { success: false, error: 'Attempt not found' };
  }
  console.log('[SUBMIT] Step 1 OK: Attempt status:', attempt.status);

  if (attempt.studentId !== session.userId) {
    console.log('[SUBMIT] Step 1 FAILED: Unauthorized');
    return { success: false, error: 'Unauthorized' };
  }

  if (attempt.status !== 'IN_PROGRESS') {
    console.log('[SUBMIT] Step 1 FAILED: Already submitted, status:', attempt.status);
    return { success: false, error: 'This attempt has already been submitted' };
  }

  console.log('[SUBMIT] Step 2: Validating answers, count:', answers.length);
  const errors = validateSubmitAnswers({ attemptId, answers });
  if (hasErrors(errors)) {
    console.log('[SUBMIT] Step 2 FAILED: Validation errors:', JSON.stringify(errors));
    return { success: false, errors };
  }
  console.log('[SUBMIT] Step 2 OK: Validation passed');

  try {
    console.log('[SUBMIT] Step 3: Serializing answers, count:', answers.length);
    console.log('[SUBMIT] Raw answers:', JSON.stringify(answers));
    
    const serializedAnswers = answers.map(a => ({
      questionId: a.questionId,
      studentAnswerJson: serializeStudentAnswer(a.answer),
    }));
    console.log('[SUBMIT] Serialized answers:', JSON.stringify(serializedAnswers));
    console.log('[SUBMIT] Step 3 OK: Serialized', serializedAnswers.length, 'answers');

    console.log('[SUBMIT] Step 4: Saving answers to DB');
    await saveAnswers(attemptId, serializedAnswers);
    console.log('[SUBMIT] Step 4 OK: Answers saved');

    console.log('[SUBMIT] Step 5: Submitting attempt');
    await submitAttempt(attemptId);
    console.log('[SUBMIT] Step 5 OK: Attempt submitted');
    
    console.log('[SUBMIT] Step 6: Grading attempt');
    let result;
    try {
      result = await gradeAttempt(attemptId);
      console.log('[SUBMIT] Step 6 result:', result ? 'OK' : 'NULL');
    } catch (gradeError) {
      console.error('[SUBMIT] Step 6 GRADING FAILED:', gradeError);
      result = await getResult(attemptId);
      console.log('[SUBMIT] Step 6 fallback result:', result);
    }

    if (!result) {
      console.log('[SUBMIT] Step 6 FAILED: No grade result available');
      return { success: false, error: 'Failed to grade attempt' };
    }

    console.log('[SUBMIT] Step 6 OK: Graded, score:', result.totalScore);
    return { success: true, data: result };
  } catch (error) {
    console.error('[SUBMIT] ERROR at step:', error);
    console.error('[SUBMIT] Stack:', error);
    return { success: false, error: 'Failed to submit answers' };
  }
}

export async function fetchResult(attemptId: string): Promise<ExamResult | null> {
  const session = await getStudentSession();
  const attempt = await getAttemptById(attemptId);
  
  if (!attempt || attempt.studentId !== session.userId) {
    return null;
  }
  
  return getResult(attemptId);
}
