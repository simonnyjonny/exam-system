import { guardAdmin } from '@/lib/rbac';
import { fetchQuestions, fetchSubjects } from './actions';
import { QuestionsClient } from './questions-client';

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await guardAdmin();

  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const limit = 20;

  const filter = {
    subjectId: params.subjectId as string | undefined,
    type: params.type as string | undefined,
    difficulty: params.difficulty as string | undefined,
    status: params.status as string | undefined,
    search: params.search as string | undefined,
  };

  const [questionsData, subjects] = await Promise.all([
    fetchQuestions(filter as any, page, limit),
    fetchSubjects(),
  ]);

  return (
    <QuestionsClient
      questions={questionsData.questions}
      total={questionsData.total}
      page={page}
      subjects={subjects}
      filter={filter}
    />
  );
}
