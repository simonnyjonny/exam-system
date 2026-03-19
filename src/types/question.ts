export type QuestionType = 
  | 'SINGLE_CHOICE' 
  | 'MULTIPLE_CHOICE' 
  | 'TRUE_FALSE' 
  | 'FILL_BLANK' 
  | 'ESSAY';

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type QuestionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionAnswer {
  single?: string;
  multiple?: string[];
  trueFalse?: boolean;
  fillBlank?: string;
  essay?: string;
}

export interface QuestionAnswerOption {
  id: string;
  text: string;
}

export interface QuestionFormData {
  subjectId: string;
  type: QuestionType;
  stem: string;
  options?: QuestionOption[];
  answer: QuestionAnswer;
  analysis?: string;
  difficulty: QuestionDifficulty;
  tags?: string[];
  status: QuestionStatus;
}

export interface QuestionListItem {
  id: string;
  stem: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  subjectId: string;
  subjectName: string;
  creatorId: string;
  creatorUsername: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface QuestionFilter {
  subjectId?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  status?: QuestionStatus;
  search?: string;
  includeDeleted?: boolean;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  SINGLE_CHOICE: 'Single Choice',
  MULTIPLE_CHOICE: 'Multiple Choice',
  TRUE_FALSE: 'True/False',
  FILL_BLANK: 'Fill in Blank',
  ESSAY: 'Essay',
};

export const QUESTION_DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export const QUESTION_STATUS_LABELS: Record<QuestionStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};
