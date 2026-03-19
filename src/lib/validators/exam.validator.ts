import { QuestionType } from '@prisma/client';

export interface ValidationError {
  field: string;
  message: string;
}

export interface StartExamInput {
  paperId: string;
}

export interface SubmitAnswerInput {
  attemptId: string;
  answers: Array<{
    questionId: string;
    answer: string | string[];
  }>;
}

const VALID_QUESTION_TYPES: QuestionType[] = [
  'SINGLE_CHOICE',
  'MULTIPLE_CHOICE',
  'TRUE_FALSE',
  'FILL_BLANK',
  'ESSAY',
];

export function validateStartExam(input: StartExamInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.paperId || input.paperId.trim() === '') {
    errors.push({ field: 'paperId', message: 'Paper ID is required' });
  }

  return errors;
}

export function validateSubmitAnswers(input: SubmitAnswerInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.attemptId || input.attemptId.trim() === '') {
    errors.push({ field: 'attemptId', message: 'Attempt ID is required' });
  }

  if (!input.answers || !Array.isArray(input.answers)) {
    errors.push({ field: 'answers', message: 'Answers must be an array' });
    return errors;
  }

  if (input.answers.length === 0) {
    errors.push({ field: 'answers', message: 'At least one answer is required' });
  }

  input.answers.forEach((answer, index) => {
    if (!answer.questionId || answer.questionId.trim() === '') {
      errors.push({ field: `answers[${index}].questionId`, message: 'Question ID is required' });
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
