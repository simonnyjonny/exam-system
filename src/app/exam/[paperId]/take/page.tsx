import { guardStudent } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import { validateTakingAccess } from '../../actions';
import { ExamTakeClient } from './take-client';

export default async function ExamTakePage({
  params,
  searchParams,
}: {
  params: Promise<{ paperId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await guardStudent();

  const { paperId } = await params;
  const search = await searchParams;
  const attemptId = search.attemptId as string;

  if (!attemptId) {
    return (
      <ExamTakeClient paperId={paperId} attemptId="" accessError="No attempt found" />
    );
  }

  const access = await validateTakingAccess(paperId, attemptId);
  if (!access.valid) {
    return (
      <ExamTakeClient paperId={paperId} attemptId={attemptId} accessError={access.error || 'Cannot access this exam'} />
    );
  }

  return <ExamTakeClient paperId={paperId} attemptId={attemptId} />;
}
