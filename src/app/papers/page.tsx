import { guardStudent } from '@/lib/rbac';
import Link from 'next/link';
import { fetchAvailablePapers, fetchStudentAttempts } from '@/app/exam/actions';
import { prisma } from '@/lib/prisma';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PapersClient } from './papers-client';

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await guardStudent();

  const params = await searchParams;

  const filter = {
    subjectId: params.subjectId as string | undefined,
    search: params.search as string | undefined,
  };

  const [papersData, attempts, subjects] = await Promise.all([
    fetchAvailablePapers(filter),
    fetchStudentAttempts(),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <PapersClient
      papers={papersData.papers}
      total={papersData.total}
      attempts={attempts}
      subjects={subjects}
      username=""
    />
  );
}
