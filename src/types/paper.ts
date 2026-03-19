export type PaperStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PaperQuestion {
  id: string;
  paperId: string;
  questionId: string;
  score: number;
  sortOrder: number;
}

export interface PaperQuestionWithDetails extends PaperQuestion {
  questionStem: string;
  questionType: string;
  difficulty: string;
}

export interface PaperFormData {
  title: string;
  subjectId: string;
  description?: string;
  durationMinutes: number;
  passingScore: number;
  status: PaperStatus;
  questions: PaperQuestionInput[];
}

export interface PaperQuestionInput {
  questionId: string;
  score: number;
  sortOrder: number;
}

export interface PaperListItem {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  description?: string | null;
  durationMinutes: number;
  passingScore: number;
  status: PaperStatus;
  publishedAt?: Date | null;
  createdBy: string;
  creatorUsername: string;
  createdAt: Date;
  updatedAt: Date;
  questionCount: number;
}

export interface PaperFilter {
  subjectId?: string;
  status?: PaperStatus;
  search?: string;
}

export const PAPER_STATUS_LABELS: Record<PaperStatus, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

export const PAPER_DEFAULT_DURATION = 90;
export const PAPER_DEFAULT_PASSING_SCORE = 60;
export const PAPER_DEFAULT_QUESTION_SCORE = 5;
