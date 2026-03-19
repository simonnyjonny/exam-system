import type { PaperStatus } from '@/types/paper';
import { PAPER_STATUSES } from '@/constants';

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreatePaperInput {
  title: string;
  subjectId: string;
  description?: string;
  durationMinutes: number;
  passingScore: number;
  status: PaperStatus;
  questions?: Array<{
    questionId: string;
    score: number;
    sortOrder: number;
  }>;
}

export interface UpdatePaperInput extends Partial<CreatePaperInput> {}

function isValidPaperStatus(status: string): status is PaperStatus {
  return PAPER_STATUSES.some(s => s.value === status);
}

export function validateCreatePaper(input: CreatePaperInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.title || input.title.trim() === '') {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (input.title && input.title.length > 255) {
    errors.push({ field: 'title', message: 'Title must be less than 255 characters' });
  }

  if (!input.subjectId || input.subjectId.trim() === '') {
    errors.push({ field: 'subjectId', message: 'Subject is required' });
  }

  if (input.description && input.description.length > 2000) {
    errors.push({ field: 'description', message: 'Description must be less than 2000 characters' });
  }

  if (!input.durationMinutes || input.durationMinutes < 1) {
    errors.push({ field: 'durationMinutes', message: 'Duration must be at least 1 minute' });
  }

  if (input.durationMinutes && input.durationMinutes > 300) {
    errors.push({ field: 'durationMinutes', message: 'Duration must be less than 300 minutes' });
  }

  if (input.passingScore === undefined || input.passingScore < 0) {
    errors.push({ field: 'passingScore', message: 'Passing score is required and must be positive' });
  }

  if (input.passingScore && input.passingScore > 100) {
    errors.push({ field: 'passingScore', message: 'Passing score must be between 0 and 100' });
  }

  if (!input.status || !isValidPaperStatus(input.status)) {
    errors.push({ field: 'status', message: 'Valid status is required' });
  }

  const questionErrors = validateQuestions(input.questions);
  errors.push(...questionErrors);

  const totalScore = (input.questions || []).reduce((sum, q) => sum + q.score, 0);
  if (input.passingScore > totalScore && totalScore > 0) {
    errors.push({ field: 'passingScore', message: `Passing score (${input.passingScore}) cannot exceed total score (${totalScore})` });
  }

  return errors;
}

export function validateUpdatePaper(input: UpdatePaperInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (input.title !== undefined) {
    if (input.title.trim() === '') {
      errors.push({ field: 'title', message: 'Title cannot be empty' });
    }
    if (input.title.length > 255) {
      errors.push({ field: 'title', message: 'Title must be less than 255 characters' });
    }
  }

  if (input.subjectId !== undefined && input.subjectId.trim() === '') {
    errors.push({ field: 'subjectId', message: 'Subject cannot be empty' });
  }

  if (input.description !== undefined && input.description?.length > 2000) {
    errors.push({ field: 'description', message: 'Description must be less than 2000 characters' });
  }

  if (input.durationMinutes !== undefined) {
    if (input.durationMinutes < 1) {
      errors.push({ field: 'durationMinutes', message: 'Duration must be at least 1 minute' });
    }
    if (input.durationMinutes > 300) {
      errors.push({ field: 'durationMinutes', message: 'Duration must be less than 300 minutes' });
    }
  }

  if (input.passingScore !== undefined) {
    if (input.passingScore < 0) {
      errors.push({ field: 'passingScore', message: 'Passing score must be positive' });
    }
    if (input.passingScore > 100) {
      errors.push({ field: 'passingScore', message: 'Passing score must be between 0 and 100' });
    }
  }

  if (input.status !== undefined && !isValidPaperStatus(input.status)) {
    errors.push({ field: 'status', message: 'Valid status is required' });
  }

  if (input.questions) {
    const questionErrors = validateQuestions(input.questions);
    errors.push(...questionErrors);

    const totalScore = input.questions.reduce((sum, q) => sum + q.score, 0);
    if (input.passingScore !== undefined && input.passingScore > totalScore && totalScore > 0) {
      errors.push({ field: 'passingScore', message: `Passing score (${input.passingScore}) cannot exceed total score (${totalScore})` });
    }
  }

  return errors;
}

function validateQuestions(questions?: CreatePaperInput['questions']): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!questions || questions.length === 0) {
    errors.push({ field: 'questions', message: 'At least one question is required' });
    return errors;
  }

  const questionIds = questions.map(q => q.questionId);
  const uniqueIds = new Set(questionIds);
  
  if (uniqueIds.size !== questionIds.length) {
    errors.push({ field: 'questions', message: 'Duplicate questions are not allowed' });
  }

  questions.forEach((q, index) => {
    if (!q.questionId || q.questionId.trim() === '') {
      errors.push({ field: `questions[${index}].questionId`, message: 'Question ID is required' });
    }

    if (q.score === undefined || q.score < 1) {
      errors.push({ field: `questions[${index}].score`, message: 'Score must be at least 1' });
    }

    if (q.score && q.score > 100) {
      errors.push({ field: `questions[${index}].score`, message: 'Score must be less than 100' });
    }
  });

  return errors;
}

export function hasErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

export function getFirstError(errors: ValidationError[]): string | null {
  return errors.length > 0 ? errors[0].message : null;
}
