import { guardStudent } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import { fetchPaperForExam, fetchStudentAttempts } from '../actions';
import { ExamStartClient } from './exam-start-client';

export default async function ExamStartPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  await guardStudent();
  const { paperId } = await params;

  const paper = await fetchPaperForExam(paperId);
  if (!paper) {
    redirect('/papers');
  }

  const attempts = await fetchStudentAttempts();
  const paperAttempts = attempts.filter((a: any) => a.paperId === paperId);

  return <ExamStartClient paperId={paperId} paper={paper} paperAttempts={paperAttempts} />;
}
