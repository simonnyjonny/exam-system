import type { QuestionType } from '@prisma/client';

export type ExamAttemptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'EXPIRED';

export interface ExamPaper {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  description: string | null;
  durationMinutes: number;
  passingScore: number;
  status: string;
  questionCount: number;
}

export interface ExamQuestion {
  id: string;
  questionId: string;
  stem: string;
  type: QuestionType;
  optionsJson: string | null;
  sortOrder: number;
  score: number;
}

export interface ExamQuestionForTaking extends ExamQuestion {
  options: string[];
}

export interface ExamQuestionWithDetails extends ExamQuestion {
  options: string[];
  answerJson: string;
}

export interface ExamAttempt {
  id: string;
  paperId: string;
  studentId: string;
  attemptNo: number;
  status: ExamAttemptStatus;
  startTime: Date | null;
  submitTime: Date | null;
  totalScore: number | null;
  createdAt: Date;
}

export interface ExamAttemptWithPaper extends ExamAttempt {
  paper: {
    id: string;
    title: string;
    subjectName: string;
  } | null;
}

export interface ExamAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  studentAnswerJson: string;
  isCorrect: boolean | null;
  score: number | null;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
}

export interface ExamFilter {
  subjectId?: string;
  search?: string;
}

export interface ExamResult {
  attemptId: string;
  paperId: string;
  paperTitle: string;
  subjectName: string;
  attemptNo: number;
  status: ExamAttemptStatus;
  startTime: Date;
  submitTime: Date | null;
  totalScore: number;
  passingScore: number;
  passed: boolean;
  questionResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  stem: string;
  type: QuestionType;
  studentAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean | null;
  score: number | null;
  maxScore: number;
}

export const EXAM_ATTEMPT_STATUS_LABELS: Record<ExamAttemptStatus, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  GRADED: 'Graded',
  EXPIRED: 'Expired',
};
