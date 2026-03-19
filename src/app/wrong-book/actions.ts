'use server';

import { getSession } from '@/lib/auth/session';

export interface WrongQuestionItem {
  id: string;
  questionId: string;
  questionStem: string;
  questionType: string;
  subjectName: string;
  wrongCount: number;
  lastWrongAt: Date;
  corrected: boolean;
}

export async function fetchWrongQuestions(): Promise<WrongQuestionItem[]> {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    throw new Error('FORBIDDEN');
  }

  const { prisma } = await import('@/lib/prisma');
  
  const wrongQuestions = await prisma.wrongQuestion.findMany({
    where: {
      studentId: session.userId,
      corrected: false,
    },
    include: {
      question: {
        include: {
          subject: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { lastWrongAt: 'desc' },
  });

  return wrongQuestions.map(wq => ({
    id: wq.id,
    questionId: wq.questionId,
    questionStem: wq.question.stem,
    questionType: wq.question.type,
    subjectName: wq.question.subject.name,
    wrongCount: wq.wrongCount,
    lastWrongAt: wq.lastWrongAt,
    corrected: wq.corrected,
  }));
}
