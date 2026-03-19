'use server';

import { getSession, type SessionData } from '@/lib/auth/session';
import { 
  getQuestions, 
  getQuestionById, 
  getQuestionForEdit, 
  createQuestion, 
  updateQuestion, 
  softDeleteQuestion,
  getSubjects 
} from '@/repositories/question.repository';
import { 
  validateCreateQuestion, 
  validateUpdateQuestion,
  hasErrors,
  type CreateQuestionInput,
  type UpdateQuestionInput
} from '@/lib/validators/question.validator';
import type { QuestionFilter, QuestionListItem } from '@/types/question';

export interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface QuestionsResult {
  questions: QuestionListItem[];
  total: number;
}

async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return session;
}

export async function fetchQuestions(
  filter: QuestionFilter = {},
  page: number = 1,
  limit: number = 20
): Promise<QuestionsResult> {
  await requireAdmin();
  return getQuestions(filter, page, limit);
}

export async function fetchQuestionById(id: string): Promise<ReturnType<typeof getQuestionById>> {
  await requireAdmin();
  return getQuestionById(id);
}

export async function fetchQuestionForEdit(id: string): Promise<ReturnType<typeof getQuestionForEdit>> {
  await requireAdmin();
  return getQuestionForEdit(id);
}

export async function fetchSubjects(): Promise<ReturnType<typeof getSubjects>> {
  await requireAdmin();
  return getSubjects();
}

export async function createQuestionAction(input: CreateQuestionInput): Promise<ActionResult> {
  let session: SessionData;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const errors = validateCreateQuestion(input);
  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  try {
    const optionsArray = input.options?.map(o => o.text).filter(Boolean) || null;
    const question = await createQuestion({
      subjectId: input.subjectId,
      type: input.type,
      stem: input.stem,
      optionsJson: optionsArray ? JSON.stringify(optionsArray) : null,
      answerJson: input.answer,
      analysis: input.analysis || null,
      difficulty: input.difficulty,
      tagsJson: input.tags || null,
      status: input.status,
      creatorId: session.userId,
    });

    return { success: true, data: question };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, error: 'Failed to create question' };
  }
}

export async function updateQuestionAction(id: string, input: UpdateQuestionInput): Promise<ActionResult> {
  let session: SessionData;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const existingQuestion = await getQuestionById(id);
  if (!existingQuestion) {
    return { success: false, error: 'Question not found' };
  }

  const errors = validateUpdateQuestion(input, existingQuestion.type);
  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  try {
    const updateData: Parameters<typeof updateQuestion>[1] = {};

    if (input.subjectId !== undefined) updateData.subjectId = input.subjectId;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.stem !== undefined) updateData.stem = input.stem;
    if (input.options !== undefined) {
      const optionsArray = input.options?.map((o: { text?: string }) => o.text).filter(Boolean) || null;
      updateData.optionsJson = optionsArray ? JSON.stringify(optionsArray) : null;
    }
    if (input.answer !== undefined) updateData.answerJson = input.answer;
    if (input.analysis !== undefined) updateData.analysis = input.analysis || null;
    if (input.difficulty !== undefined) updateData.difficulty = input.difficulty;
    if (input.tags !== undefined) updateData.tagsJson = input.tags || null;
    if (input.status !== undefined) updateData.status = input.status;

    const question = await updateQuestion(id, updateData);

    return { success: true, data: question };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, error: 'Failed to update question' };
  }
}

export async function deleteQuestionAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const existingQuestion = await getQuestionById(id);
  if (!existingQuestion) {
    return { success: false, error: 'Question not found' };
  }

  try {
    await softDeleteQuestion(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, error: 'Failed to delete question' };
  }
}
