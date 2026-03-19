import { prisma } from '@/lib/prisma';
import { Paper, PaperStatus, Subject, User, Prisma } from '@prisma/client';
import type { PaperListItem, PaperFilter, PaperQuestionInput } from '@/types/paper';
import { PAGINATION } from '@/constants';

type PaperWithRelations = Paper & {
  subject: Subject;
  creator: User;
  paperQuestions?: Array<{
    id: string;
    questionId: string;
    score: number;
    sortOrder: number;
  }>;
};

interface CreatePaperData {
  title: string;
  subjectId: string;
  description?: string | null;
  durationMinutes: number;
  passingScore: number;
  status: PaperStatus;
  createdBy: string;
  questions?: PaperQuestionInput[];
}

interface UpdatePaperData {
  title?: string;
  subjectId?: string;
  description?: string | null;
  durationMinutes?: number;
  passingScore?: number;
  status?: PaperStatus;
  publishedAt?: Date | null;
  questions?: PaperQuestionInput[];
}

function mapPaperToListItem(paper: PaperWithRelations, questionCount: number = 0): PaperListItem {
  return {
    id: paper.id,
    title: paper.title,
    subjectId: paper.subjectId,
    subjectName: paper.subject.name,
    description: paper.description,
    durationMinutes: paper.durationMinutes,
    passingScore: paper.passingScore,
    status: paper.status,
    publishedAt: paper.publishedAt,
    createdBy: paper.createdBy,
    creatorUsername: paper.creator.username,
    createdAt: paper.createdAt,
    updatedAt: paper.updatedAt,
    questionCount,
  };
}

export async function getPapers(
  filter: PaperFilter = {},
  page: number = PAGINATION.DEFAULT_PAGE,
  limit: number = PAGINATION.DEFAULT_LIMIT
): Promise<{ papers: PaperListItem[]; total: number }> {
  const { subjectId, status, search } = filter;
  
  const where: Prisma.PaperWhereInput = {
    deletedAt: null,
  };
  
  if (subjectId) {
    where.subjectId = subjectId;
  }
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [papers, total] = await Promise.all([
    prisma.paper.findMany({
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
    prisma.paper.count({ where }),
  ]);

  const paperIds = papers.map(p => p.id);
  const questionCounts = await prisma.paperQuestion.groupBy({
    by: ['paperId'],
    where: { paperId: { in: paperIds } },
    _count: { questionId: true },
  });

  const countMap = new Map(questionCounts.map(q => [q.paperId, q._count.questionId]));

  return {
    papers: papers.map(p => mapPaperToListItem(p, countMap.get(p.id) || 0)),
    total,
  };
}

export async function getPaperById(id: string): Promise<PaperListItem | null> {
  const paper = await prisma.paper.findFirst({
    where: { id },
    include: {
      subject: true,
      creator: true,
    },
  });

  if (!paper) return null;

  const questionCount = await prisma.paperQuestion.count({ where: { paperId: id } });
  return mapPaperToListItem(paper, questionCount);
}

export async function getPaperForEdit(id: string): Promise<(Paper & { paperQuestions: Array<{ questionId: string; score: number; sortOrder: number }> }) | null> {
  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      paperQuestions: {
        select: {
          questionId: true,
          score: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return paper;
}

export async function createPaper(data: CreatePaperData): Promise<Paper> {
  const { questions, ...paperData } = data;
  
  const paper = await prisma.paper.create({
    data: paperData,
  });

  if (questions && questions.length > 0) {
    await prisma.paperQuestion.createMany({
      data: questions.map(q => ({
        paperId: paper.id,
        questionId: q.questionId,
        score: q.score,
        sortOrder: q.sortOrder,
      })),
    });
  }

  return paper;
}

export async function updatePaper(id: string, data: UpdatePaperData): Promise<Paper> {
  const { questions, ...paperData } = data;

  if (questions !== undefined) {
    await prisma.paperQuestion.deleteMany({ where: { paperId: id } });
    
    if (questions.length > 0) {
      await prisma.paperQuestion.createMany({
        data: questions.map(q => ({
          paperId: id,
          questionId: q.questionId,
          score: q.score,
          sortOrder: q.sortOrder,
        })),
      });
    }
  }

  return prisma.paper.update({
    where: { id },
    data: paperData,
  });
}

export async function publishPaper(id: string): Promise<Paper> {
  return prisma.paper.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });
}

export async function archivePaper(id: string): Promise<Paper> {
  return prisma.paper.update({
    where: { id },
    data: {
      status: 'ARCHIVED',
    },
  });
}

export async function deletePaper(id: string): Promise<Paper> {
  return prisma.paper.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function getQuestionsForPaper(
  subjectId?: string,
  excludePaperId?: string
): Promise<Array<{
  id: string;
  stem: string;
  type: string;
  difficulty: string;
}>> {
  const existingQuestionIds = excludePaperId
    ? await prisma.paperQuestion.findMany({
        where: { paperId: excludePaperId },
        select: { questionId: true },
      }).then(r => r.map(q => q.questionId))
    : [];

  const where: Prisma.QuestionWhereInput = {
    status: 'PUBLISHED',
    deletedAt: null,
  };

  if (subjectId) {
    where.subjectId = subjectId;
  }

  if (existingQuestionIds.length > 0) {
    where.id = { notIn: existingQuestionIds };
  }

  return prisma.question.findMany({
    where,
    select: {
      id: true,
      stem: true,
      type: true,
      difficulty: true,
    },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });
}

export async function getPaperQuestionsWithDetails(paperId: string): Promise<Array<{
  id: string;
  questionId: string;
  score: number;
  sortOrder: number;
  questionStem: string;
  questionType: string;
  difficulty: string;
}>> {
  const paperQuestions = await prisma.paperQuestion.findMany({
    where: { paperId },
    include: {
      question: {
        select: {
          stem: true,
          type: true,
          difficulty: true,
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return paperQuestions.map(pq => ({
    id: pq.id,
    questionId: pq.questionId,
    score: pq.score,
    sortOrder: pq.sortOrder,
    questionStem: pq.question.stem,
    questionType: pq.question.type,
    difficulty: pq.question.difficulty,
  }));
}

export async function getSubjects(): Promise<Subject[]> {
  return prisma.subject.findMany({
    orderBy: { name: 'asc' },
  });
}
