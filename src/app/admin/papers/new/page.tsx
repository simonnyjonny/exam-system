import { guardAdmin } from '@/lib/rbac';
import { fetchSubjects } from '../actions';
import { NewPaperClient } from './new-paper-client';

export default async function NewPaperPage() {
  await guardAdmin();
  const subjects = await fetchSubjects();
  return <NewPaperClient subjects={subjects} />;
}
