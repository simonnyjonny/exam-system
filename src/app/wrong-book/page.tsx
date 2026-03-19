import { guardStudent } from '@/lib/rbac';
import { fetchWrongQuestions } from './actions';
import { WrongBookClient } from './wrong-book-client';

export default async function WrongBookPage() {
  await guardStudent();
  const wrongQuestions = await fetchWrongQuestions();
  return <WrongBookClient wrongQuestions={wrongQuestions as any} />;
}
