import { guardAdmin } from '@/lib/rbac';
import { notFound } from 'next/navigation';
import { fetchQuestionForEdit, fetchSubjects } from '../actions';
import { EditQuestionClient } from './edit-question-client';

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardAdmin();
  const { id } = await params;

  const [question, subjects] = await Promise.all([
    fetchQuestionForEdit(id),
    fetchSubjects(),
  ]);

  if (!question) {
    notFound();
  }

  return <EditQuestionClient questionId={id} question={question} subjects={subjects} />;
}
