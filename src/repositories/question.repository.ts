import { prisma } from '@/lib/prisma';
import { 
  Question, 
  QuestionType, 
  QuestionDifficulty, 
  QuestionStatus,
  Subject,
  User 
} from '@prisma/client';
import type { QuestionListItem, QuestionFilter } from '@/types/question';
import { PAGINATION } from '@/constants';

type QuestionWithRelations = Question & {
  subject: Subject;
  creator: User;
};

interface CreateQuestionData {
  subjectId: string;
  type: QuestionType;
  stem: string;
  optionsJson?: string | null;
  answerJson: object;
  analysis?: string | null;
  difficulty: QuestionDifficulty;
  tagsJson?: string | null;
  status: QuestionStatus;
  creatorId: string;
}

interface UpdateQuestionData {
  subjectId?: string;
  type?: QuestionType;
  stem?: string;
  optionsJson?: string | null;
  answerJson?: object;
  analysis?: string | null;
  difficulty?: QuestionDifficulty;
  tagsJson?: string | null;
  status?: QuestionStatus;
}

function mapQuestionToListItem(question: QuestionWithRelations): QuestionListItem {
  return {
    id: question.id,
    stem: question.stem,
    type: question.type,
    difficulty: question.difficulty,
    status: question.status,
    subjectId: question.subjectId,
    subjectName: question.subject.name,
    creatorId: question.creatorId,
    creatorUsername: question.creator.username,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
    deletedAt: question.deletedAt,
  };
}

export async function getQuestions(
  filter: QuestionFilter = {},
  page: number = PAGINATION.DEFAULT_PAGE,
  limit: number = PAGINATION.DEFAULT_LIMIT
): Promise<{ questions: QuestionListItem[]; total: number }> {
  const { subjectId, type, difficulty, status, search, includeDeleted } = filter;
  
  const where: Parameters<typeof prisma.question.findMany>[0]['where'] = {};
  
  if (!includeDeleted) {
    where.deletedAt = null;
  }
  
  if (subjectId) {
    where.subjectId = subjectId;
  }
  
  if (type) {
    where.type = type;
  }
  
  if (difficulty) {
    where.difficulty = difficulty;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where.stem = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: {
        subject: true,
        creator: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.question.count({ where }),
  ]);

  return {
    questions: questions.map(mapQuestionToListItem),
    total,
  };
}

export async function getQuestionById(id: string, includeDeleted = false): Promise<QuestionListItem | null> {
  const where: Parameters<typeof prisma.question.findFirst>[0]['where'] = {
    id,
  };

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  const question = await prisma.question.findFirst({
    where,
    include: {
      subject: true,
      creator: true,
    },
  });

  if (!question) return null;
  return mapQuestionToListItem(question);
}

export async function getQuestionForEdit(id: string): Promise<Question | null> {
  return prisma.question.findUnique({
    where: { id },
  });
}

export async function createQuestion(data: CreateQuestionData): Promise<Question> {
  return prisma.question.create({
    data,
  });
}

export async function updateQuestion(id: string, data: UpdateQuestionData): Promise<Question> {
  return prisma.question.update({
    where: { id },
    data,
  });
}

export async function softDeleteQuestion(id: string): Promise<Question> {
  return prisma.question.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

export async function restoreQuestion(id: string): Promise<Question> {
  return prisma.question.update({
    where: { id },
    data: {
      deletedAt: null,
    },
  });
}

export async function getSubjects(): Promise<Subject[]> {
  return prisma.subject.findMany({
    orderBy: { name: 'asc' },
  });
}
