export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PAPERS: '/papers',
  WRONG_BOOK: '/wrong-book',
  ADMIN: '/admin',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_PAPERS: '/admin/papers',
  ADMIN_STUDENTS: '/admin/students',
} as const;

export const QUESTION_TYPES = [
  { value: 'SINGLE_CHOICE', label: 'Single Choice' },
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  { value: 'TRUE_FALSE', label: 'True/False' },
  { value: 'FILL_BLANK', label: 'Fill in Blank' },
  { value: 'ESSAY', label: 'Essay' },
] as const;

export const QUESTION_DIFFICULTIES = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
] as const;

export const QUESTION_STATUSES = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
] as const;

export const PAPER_STATUSES = QUESTION_STATUSES;

export const PAPER_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 60, label: '60 minutes' },
  { value: 90, label: '90 minutes' },
  { value: 120, label: '120 minutes' },
  { value: 180, label: '180 minutes' },
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
