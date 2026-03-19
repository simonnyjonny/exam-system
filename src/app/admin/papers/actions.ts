'use server';

import { getSession, type SessionData } from '@/lib/auth/session';
import {
  getPapers,
  getPaperById,
  getPaperForEdit,
  createPaper,
  updatePaper,
  publishPaper,
  archivePaper,
  deletePaper,
  getQuestionsForPaper,
  getPaperQuestionsWithDetails,
  getSubjects,
} from '@/repositories/paper.repository';
import {
  validateCreatePaper,
  validateUpdatePaper,
  hasErrors,
  type CreatePaperInput,
  type UpdatePaperInput
} from '@/lib/validators/paper.validator';
import type { PaperFilter, PaperListItem } from '@/types/paper';
import { Paper } from '@prisma/client';

export interface ActionResult<T = void> {
  success: boolean;
  error?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface PapersResult {
  papers: PaperListItem[];
  total: number;
}

async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return session;
}

export async function fetchPapers(
  filter: PaperFilter = {},
  page: number = 1,
  limit: number = 20
): Promise<PapersResult> {
  await requireAdmin();
  return getPapers(filter, page, limit);
}

export async function fetchPaperById(id: string): Promise<ReturnType<typeof getPaperById>> {
  await requireAdmin();
  return getPaperById(id);
}

export async function fetchPaperForEdit(id: string): Promise<ReturnType<typeof getPaperForEdit>> {
  await requireAdmin();
  return getPaperForEdit(id);
}

export async function fetchSubjects(): Promise<ReturnType<typeof getSubjects>> {
  await requireAdmin();
  return getSubjects();
}

export async function fetchQuestionsForPaper(
  subjectId?: string,
  excludePaperId?: string
): Promise<ReturnType<typeof getQuestionsForPaper>> {
  await requireAdmin();
  return getQuestionsForPaper(subjectId, excludePaperId);
}

export async function fetchPaperQuestionsWithDetails(
  paperId: string
): Promise<ReturnType<typeof getPaperQuestionsWithDetails>> {
  await requireAdmin();
  return getPaperQuestionsWithDetails(paperId);
}

export async function createPaperAction(input: CreatePaperInput): Promise<ActionResult<Paper>> {
  let session: SessionData;
  try {
    session = await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const errors = validateCreatePaper(input);
  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  try {
    const paper = await createPaper({
      title: input.title,
      subjectId: input.subjectId,
      description: input.description || null,
      durationMinutes: input.durationMinutes,
      passingScore: input.passingScore,
      status: input.status,
      createdBy: session.userId,
      questions: input.questions,
    });

    return { success: true, data: paper };
  } catch (error) {
    console.error('Error creating paper:', error);
    return { success: false, error: 'Failed to create paper' };
  }
}

export async function updatePaperAction(id: string, input: UpdatePaperInput): Promise<ActionResult<Paper>> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const existingPaper = await getPaperById(id);
  if (!existingPaper) {
    return { success: false, error: 'Paper not found' };
  }

  const errors = validateUpdatePaper(input);
  if (hasErrors(errors)) {
    return { success: false, errors };
  }

  try {
    const updateData: Parameters<typeof updatePaper>[1] = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.subjectId !== undefined) updateData.subjectId = input.subjectId;
    if (input.description !== undefined) updateData.description = input.description || null;
    if (input.durationMinutes !== undefined) updateData.durationMinutes = input.durationMinutes;
    if (input.passingScore !== undefined) updateData.passingScore = input.passingScore;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.questions !== undefined) updateData.questions = input.questions;

    const paper = await updatePaper(id, updateData);

    return { success: true, data: paper };
  } catch (error) {
    console.error('Error updating paper:', error);
    return { success: false, error: 'Failed to update paper' };
  }
}

export async function publishPaperAction(id: string): Promise<ActionResult<Paper>> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const existingPaper = await getPaperById(id);
  if (!existingPaper) {
    return { success: false, error: 'Paper not found' };
  }

  if (existingPaper.status === 'PUBLISHED') {
    return { success: false, error: 'Paper is already published' };
  }

  if (existingPaper.status === 'ARCHIVED') {
    return { success: false, error: 'Cannot publish an archived paper' };
  }

  try {
    const paper = await publishPaper(id);
    return { success: true, data: paper };
  } catch (error) {
    console.error('Error publishing paper:', error);
    return { success: false, error: 'Failed to publish paper' };
  }
}

export async function archivePaperAction(id: string): Promise<ActionResult<Paper>> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const existingPaper = await getPaperById(id);
  if (!existingPaper) {
    return { success: false, error: 'Paper not found' };
  }

  if (existingPaper.status === 'ARCHIVED') {
    return { success: false, error: 'Paper is already archived' };
  }

  try {
    const paper = await archivePaper(id);
    return { success: true, data: paper };
  } catch (error) {
    console.error('Error archiving paper:', error);
    return { success: false, error: 'Failed to archive paper' };
  }
}

export async function deletePaperAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const existingPaper = await getPaperById(id);
  if (!existingPaper) {
    return { success: false, error: 'Paper not found' };
  }

  try {
    await deletePaper(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting paper:', error);
    return { success: false, error: 'Failed to delete paper' };
  }
}
