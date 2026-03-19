import { guardStudent } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import { fetchResult } from '../../actions';
import { ResultClient } from './result-client';

export default async function ExamResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  await guardStudent();
  const { attemptId } = await params;

  const result = await fetchResult(attemptId);

  if (!result) {
    redirect('/papers');
  }

  return <ResultClient result={result} />;
}
