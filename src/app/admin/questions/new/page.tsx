import { guardAdmin } from '@/lib/rbac';
import { fetchSubjects } from '../actions';
import { NewQuestionClient } from './new-question-client';

export default async function NewQuestionPage() {
  await guardAdmin();
  const subjects = await fetchSubjects();
  return <NewQuestionClient subjects={subjects} />;
}
