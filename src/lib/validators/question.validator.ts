import type { QuestionType, QuestionDifficulty, QuestionStatus } from '@/types/question';
import { QUESTION_TYPES, QUESTION_DIFFICULTIES, QUESTION_STATUSES } from '@/constants';

export interface ValidationError {
  field: string;
  message: string;
}

export interface CreateQuestionInput {
  subjectId: string;
  type: QuestionType;
  stem: string;
  options?: { id: string; text: string }[];
  answer: {
    single?: string;
    multiple?: string[];
    trueFalse?: boolean;
    fillBlank?: string;
    essay?: string;
  };
  analysis?: string;
  difficulty: QuestionDifficulty;
  tags?: string[];
  status: QuestionStatus;
}

export interface UpdateQuestionInput extends Partial<CreateQuestionInput> {}

function isValidQuestionType(type: string): type is QuestionType {
  return QUESTION_TYPES.some(t => t.value === type);
}

function isValidDifficulty(difficulty: string): difficulty is QuestionDifficulty {
  return QUESTION_DIFFICULTIES.some(d => d.value === difficulty);
}

function isValidStatus(status: string): status is QuestionStatus {
  return QUESTION_STATUSES.some(s => s.value === status);
}

export function validateCreateQuestion(input: CreateQuestionInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.subjectId || input.subjectId.trim() === '') {
    errors.push({ field: 'subjectId', message: 'Subject is required' });
  }

  if (!input.type || !isValidQuestionType(input.type)) {
    errors.push({ field: 'type', message: 'Valid question type is required' });
  }

  if (!input.stem || input.stem.trim() === '') {
    errors.push({ field: 'stem', message: 'Question stem is required' });
  }

  if (input.stem && input.stem.length > 5000) {
    errors.push({ field: 'stem', message: 'Question stem must be less than 5000 characters' });
  }

  if (!input.difficulty || !isValidDifficulty(input.difficulty)) {
    errors.push({ field: 'difficulty', message: 'Valid difficulty is required' });
  }

  if (!input.status || !isValidStatus(input.status)) {
    errors.push({ field: 'status', message: 'Valid status is required' });
  }

  const answerErrors = validateAnswer(input.type, input.answer);
  errors.push(...answerErrors);

  if (input.type === 'SINGLE_CHOICE' || input.type === 'MULTIPLE_CHOICE') {
    if (!input.options || input.options.length < 2) {
      errors.push({ field: 'options', message: 'At least 2 options are required for choice questions' });
    }
    
    if (input.options) {
      const emptyOptions = input.options.filter(o => !o.text || o.text.trim() === '');
      if (emptyOptions.length > 0) {
        errors.push({ field: 'options', message: 'All options must have text' });
      }
    }
  }

  if (input.analysis && input.analysis.length > 2000) {
    errors.push({ field: 'analysis', message: 'Analysis must be less than 2000 characters' });
  }

  if (input.tags && input.tags.length > 20) {
    errors.push({ field: 'tags', message: 'Maximum 20 tags allowed' });
  }

  return errors;
}

export function validateUpdateQuestion(input: UpdateQuestionInput, existingType?: QuestionType): ValidationError[] {
  const errors: ValidationError[] = [];

  if (input.subjectId !== undefined && input.subjectId.trim() === '') {
    errors.push({ field: 'subjectId', message: 'Subject cannot be empty' });
  }

  if (input.type !== undefined && !isValidQuestionType(input.type)) {
    errors.push({ field: 'type', message: 'Valid question type is required' });
  }

  if (input.stem !== undefined) {
    if (input.stem.trim() === '') {
      errors.push({ field: 'stem', message: 'Question stem cannot be empty' });
    }
    if (input.stem.length > 5000) {
      errors.push({ field: 'stem', message: 'Question stem must be less than 5000 characters' });
    }
  }

  if (input.difficulty !== undefined && !isValidDifficulty(input.difficulty)) {
    errors.push({ field: 'difficulty', message: 'Valid difficulty is required' });
  }

  if (input.status !== undefined && !isValidStatus(input.status)) {
    errors.push({ field: 'status', message: 'Valid status is required' });
  }

  if (input.answer) {
    const questionType = input.type ?? existingType;
    const answerErrors = validateAnswer(questionType || 'SINGLE_CHOICE', input.answer);
    errors.push(...answerErrors);
  }

  if (input.analysis !== undefined && input.analysis?.length > 2000) {
    errors.push({ field: 'analysis', message: 'Analysis must be less than 2000 characters' });
  }

  return errors;
}

function validateAnswer(type: QuestionType, answer: CreateQuestionInput['answer']): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (type) {
    case 'SINGLE_CHOICE':
      if (!answer.single || answer.single.trim() === '') {
        errors.push({ field: 'answer.single', message: 'Please select a correct answer' });
      }
      break;

    case 'MULTIPLE_CHOICE':
      if (!answer.multiple || answer.multiple.length === 0) {
        errors.push({ field: 'answer.multiple', message: 'Please select at least one correct answer' });
      }
      break;

    case 'TRUE_FALSE':
      if (answer.trueFalse === undefined) {
        errors.push({ field: 'answer.trueFalse', message: 'Please select True or False' });
      }
      break;

    case 'FILL_BLANK':
      if (!answer.fillBlank || answer.fillBlank.trim() === '') {
        errors.push({ field: 'answer.fillBlank', message: 'Fill in blank answer is required' });
      }
      break;

    case 'ESSAY':
      break;
  }

  return errors;
}

export function hasErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

export function getFirstError(errors: ValidationError[]): string | null {
  return errors.length > 0 ? errors[0].message : null;
}
