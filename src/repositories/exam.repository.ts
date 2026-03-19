import { prisma } from '@/lib/prisma';
import { Prisma, ExamAttemptStatus } from '@prisma/client';
import type { ExamPaper, ExamQuestionWithDetails, ExamQuestionForTaking, ExamAttempt, ExamAttemptWithPaper, ExamAnswer, ExamFilter, ExamResult, QuestionResult } from '@/types/exam';
import { parseQuestionAnswer, parseQuestionOptions } from '@/lib/grading';

export async function getAvailablePapers(
  studentId: string,
  filter: ExamFilter = {}
): Promise<{ papers: ExamPaper[]; total: number }> {
  const { subjectId, search } = filter;

  const existingPaperIds = await prisma.examAttempt.findMany({
    where: { studentId },
    select: { paperId: true },
    distinct: ['paperId'],
  });
  
  const attemptedPaperIds = new Set(existingPaperIds.map(e => e.paperId));

  const where: Prisma.PaperWhereInput = {
    status: 'PUBLISHED',
    deletedAt: null,
    paperQuestions: {
      some: {},
    },
  };

  if (subjectId) {
    where.subjectId = subjectId;
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
      },
      orderBy: { publishedAt: 'desc' },
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
    papers: papers.map(p => ({
      id: p.id,
      title: p.title,
      subjectId: p.subjectId,
      subjectName: p.subject.name,
      description: p.description,
      durationMinutes: p.durationMinutes,
      passingScore: p.passingScore,
      status: p.status,
      questionCount: countMap.get(p.id) || 0,
    })),
    total,
  };
}

export async function getPaperWithQuestions(paperId: string): Promise<ExamQuestionForTaking[] | null> {
  const paperQuestions = await prisma.paperQuestion.findMany({
    where: { paperId },
    include: {
      question: {
        select: {
          id: true,
          stem: true,
          type: true,
          optionsJson: true,
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  if (paperQuestions.length === 0) {
    return null;
  }

  return paperQuestions.map(pq => ({
    id: pq.id,
    questionId: pq.question.id,
    stem: pq.question.stem,
    type: pq.question.type,
    optionsJson: pq.question.optionsJson as string | null,
    sortOrder: pq.sortOrder,
    score: pq.score,
    options: parseQuestionOptions(pq.question.optionsJson as string | null),
  }));
}

export async function getPaperById(paperId: string): Promise<ExamPaper | null> {
  const paper = await prisma.paper.findFirst({
    where: { id: paperId, status: 'PUBLISHED', deletedAt: null },
    include: {
      subject: true,
    },
  });

  if (!paper) return null;

  const questionCount = await prisma.paperQuestion.count({
    where: { paperId },
  });

  return {
    id: paper.id,
    title: paper.title,
    subjectId: paper.subjectId,
    subjectName: paper.subject.name,
    description: paper.description,
    durationMinutes: paper.durationMinutes,
    passingScore: paper.passingScore,
    status: paper.status,
    questionCount,
  };
}

export async function createAttempt(
  paperId: string,
  studentId: string
): Promise<ExamAttempt> {
  const lastAttempt = await prisma.examAttempt.findFirst({
    where: { paperId, studentId },
    orderBy: { attemptNo: 'desc' },
  });

  const attemptNo = (lastAttempt?.attemptNo || 0) + 1;

  const attempt = await prisma.examAttempt.create({
    data: {
      paperId,
      studentId,
      attemptNo,
      status: 'NOT_STARTED',
    },
  });

  return attempt;
}

export async function startAttempt(attemptId: string): Promise<ExamAttempt> {
  return prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: 'IN_PROGRESS',
      startTime: new Date(),
    },
  });
}

export async function getInProgressAttempt(studentId: string, paperId: string): Promise<ExamAttempt | null> {
  return prisma.examAttempt.findFirst({
    where: {
      studentId,
      paperId,
      status: 'IN_PROGRESS',
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAttemptById(attemptId: string): Promise<ExamAttempt | null> {
  return prisma.examAttempt.findUnique({
    where: { id: attemptId },
  });
}

export async function getAttemptWithPaper(attemptId: string): Promise<(ExamAttempt & { paper: { id: string; title: string; subject: { name: string }; durationMinutes: number; passingScore: number } }) | null> {
  return prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      paper: {
        include: {
          subject: {
            select: { name: true },
          },
        },
      },
    },
  });
}

export async function getAttemptsByStudent(studentId: string): Promise<ExamAttemptWithPaper[]> {
  const result = await prisma.examAttempt.findMany({
    where: { studentId },
    include: {
      paper: {
        select: {
          id: true,
          title: true,
          subject: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return result.map(r => ({
    id: r.id,
    paperId: r.paperId,
    studentId: r.studentId,
    attemptNo: r.attemptNo,
    status: r.status,
    startTime: r.startTime,
    submitTime: r.submitTime,
    totalScore: r.totalScore,
    createdAt: r.createdAt,
    paper: r.paper ? {
      id: r.paper.id,
      title: r.paper.title,
      subjectName: r.paper.subject.name,
    } : null,
  }));
}

export async function saveAnswers(
  attemptId: string,
  answers: Array<{ questionId: string; studentAnswerJson: string }>
): Promise<void> {
  console.log('[SAVE_ANSWERS] Saving', answers.length, 'answers for attempt:', attemptId);
  for (const answer of answers) {
    console.log('[SAVE_ANSWERS] Saving questionId:', answer.questionId, 'answer:', answer.studentAnswerJson);
    await prisma.examAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId: answer.questionId,
        },
      },
      create: {
        attemptId,
        questionId: answer.questionId,
        studentAnswerJson: answer.studentAnswerJson,
      },
      update: {
        studentAnswerJson: answer.studentAnswerJson,
      },
    });
    console.log('[SAVE_ANSWERS] Saved questionId:', answer.questionId);
  }
  console.log('[SAVE_ANSWERS] All answers saved');
}

export async function submitAttempt(attemptId: string): Promise<ExamAttempt> {
  return prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: 'SUBMITTED',
      submitTime: new Date(),
    },
  });
}

export async function getAttemptWithAnswers(attemptId: string) {
  return prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      paper: {
        include: {
          subject: { select: { name: true } },
          paperQuestions: {
            include: {
              question: {
                select: {
                  id: true,
                  stem: true,
                  type: true,
                  optionsJson: true,
                  answerJson: true,
                },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
      },
      answers: {
        select: {
          questionId: true,
          studentAnswerJson: true,
          isCorrect: true,
          score: true,
        },
      },
    },
  });
}

export async function gradeAttempt(attemptId: string): Promise<ExamResult | null> {
  console.log('[GRADE] Starting grade for attempt:', attemptId);
  const attempt = await getAttemptWithAnswers(attemptId);
  if (!attempt) {
    console.log('[GRADE] FAILED: Attempt not found');
    return null;
  }
  console.log('[GRADE] Attempt found, paper:', attempt.paper.title, 'questions:', attempt.paper.paperQuestions.length);

  const { gradeAnswer, deserializeStudentAnswer, parseQuestionAnswer } = await import('@/lib/grading');

  let totalScore = 0;
  const questionResults: QuestionResult[] = [];

  console.log('[GRADE] Total questions in paper:', attempt.paper.paperQuestions.length);
  console.log('[GRADE] Total answers in attempt:', attempt.answers.length);

  for (const pq of attempt.paper.paperQuestions) {
    console.log('[GRADE] ============================================');
    console.log('[GRADE] Processing question:', pq.question.id, 'type:', pq.question.type);
    console.log('[GRADE] Looking for answer with questionId:', pq.question.id);
    
    const answer = attempt.answers.find(a => a.questionId === pq.question.id);
    console.log('[GRADE] Found answer:', answer);
    
    const studentAnswerStr = (answer?.studentAnswerJson as string) || '';
    console.log('[GRADE] Student answer raw:', studentAnswerStr);
    
    const studentAnswer = deserializeStudentAnswer(studentAnswerStr);
    console.log('[GRADE] Student answer parsed:', studentAnswer);
    
    console.log('[GRADE] Correct answer raw:', pq.question.answerJson);
    const correctAnswer = parseQuestionAnswer(pq.question.answerJson as string);
    console.log('[GRADE] Correct answer parsed:', correctAnswer);

    let result;
    try {
      result = gradeAnswer(
        pq.question.type,
        studentAnswer,
        correctAnswer,
        pq.score
      );
      console.log('[GRADE] Result:', result);
    } catch (err) {
      console.error('[GRADE] ERROR grading question:', pq.question.id, err);
      result = { isCorrect: null, score: 0, feedback: 'Grading error: ' + String(err) };
      console.log('[GRADE] Using fallback result:', result);
    }

    await prisma.examAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId: pq.question.id,
        },
      },
      create: {
        attemptId,
        questionId: pq.question.id,
        studentAnswerJson: studentAnswerStr,
        isCorrect: result.isCorrect,
        score: result.score,
      },
      update: {
        studentAnswerJson: studentAnswerStr,
        isCorrect: result.isCorrect,
        score: result.score,
      },
    });

    if (result.isCorrect === false) {
      await recordWrongQuestion(attempt.studentId, pq.question.id, attemptId);
    }

    totalScore += result.score;

    questionResults.push({
      questionId: pq.question.id,
      stem: pq.question.stem,
      type: pq.question.type,
      studentAnswer,
      correctAnswer,
      isCorrect: result.isCorrect,
      score: result.score,
      maxScore: pq.score,
    });
  }

  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: 'GRADED',
      totalScore,
      autoGradedAt: new Date(),
    },
  });

  const passingScore = attempt.paper.passingScore;
  const percentage = totalScore;
  const passed = percentage >= passingScore;

  return {
    attemptId: attempt.id,
    paperId: attempt.paperId,
    paperTitle: attempt.paper.title,
    subjectName: attempt.paper.subject.name,
    attemptNo: attempt.attemptNo,
    status: 'GRADED',
    startTime: attempt.startTime!,
    submitTime: attempt.submitTime,
    totalScore,
    passingScore,
    passed,
    questionResults,
  };
}

async function recordWrongQuestion(
  studentId: string,
  questionId: string,
  attemptId: string
): Promise<void> {
  const existing = await prisma.wrongQuestion.findUnique({
    where: {
      studentId_questionId: {
        studentId,
        questionId,
      },
    },
  });

  if (existing) {
    await prisma.wrongQuestion.update({
      where: { id: existing.id },
      data: {
        wrongCount: existing.wrongCount + 1,
        lastWrongAt: new Date(),
        corrected: false,
        sourceAttemptId: attemptId,
      },
    });
  } else {
    await prisma.wrongQuestion.create({
      data: {
        studentId,
        questionId,
        sourceAttemptId: attemptId,
        wrongCount: 1,
        lastWrongAt: new Date(),
      },
    });
  }
}

export async function getResult(attemptId: string): Promise<ExamResult | null> {
  console.log('[GET_RESULT] Fetching result for:', attemptId);
  const attempt = await getAttemptWithAnswers(attemptId);
  console.log('[GET_RESULT] Attempt status:', attempt?.status);
  
  // Allow both GRADED and SUBMITTED status - SUBMITTED might be waiting for manual grading
  if (!attempt || (attempt.status !== 'GRADED' && attempt.status !== 'SUBMITTED')) {
    console.log('[GET_RESULT] Invalid status, returning null');
    return null;
  }
  
  // If submitted but not graded, still show the result with empty scores
  const isGraded = attempt.status === 'GRADED';

  const { deserializeStudentAnswer, parseQuestionAnswer } = await import('@/lib/grading');

  console.log('[GET_RESULT] Questions in paper:', attempt.paper.paperQuestions.length);
  console.log('[GET_RESULT] Answers in attempt:', attempt.answers.length);

  const questionResults: QuestionResult[] = attempt.paper.paperQuestions.map(pq => {
    const answer = attempt.answers.find(a => a.questionId === pq.question.id);
    console.log('[GET_RESULT] Question:', pq.question.id, 'Answer found:', answer ? 'yes' : 'no');
    
    const studentAnswerStr = (answer?.studentAnswerJson as string) || '';
    console.log('[GET_RESULT] Student answer raw:', studentAnswerStr);
    
    const studentAnswer = deserializeStudentAnswer(studentAnswerStr);
    console.log('[GET_RESULT] Student answer parsed:', studentAnswer);
    
    const correctAnswer = parseQuestionAnswer(pq.question.answerJson as string);
    console.log('[GET_RESULT] Correct answer parsed:', correctAnswer);
    console.log('[GET_RESULT] isCorrect:', answer?.isCorrect, 'score:', answer?.score);

    return {
      questionId: pq.question.id,
      stem: pq.question.stem,
      type: pq.question.type,
      studentAnswer,
      correctAnswer,
      isCorrect: answer?.isCorrect ?? null,
      score: answer?.score ?? null,
      maxScore: pq.score,
    };
  });

  return {
    attemptId: attempt.id,
    paperId: attempt.paperId,
    paperTitle: attempt.paper.title,
    subjectName: attempt.paper.subject.name,
    attemptNo: attempt.attemptNo,
    status: attempt.status as ExamAttemptStatus,
    startTime: attempt.startTime!,
    submitTime: attempt.submitTime,
    totalScore: isGraded ? (attempt.totalScore ?? 0) : 0,
    passingScore: attempt.paper.passingScore,
    passed: isGraded ? ((attempt.totalScore ?? 0) >= attempt.paper.passingScore) : false,
    questionResults,
  };
}
