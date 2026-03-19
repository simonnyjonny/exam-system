import { guardAdmin } from '@/lib/rbac';
import { fetchPapers, fetchSubjects } from './actions';
import { PapersClient } from './papers-client';

export default async function AdminPapersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await guardAdmin();

  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const limit = 20;

  const getStatusParam = (param: string | string[] | undefined): string | undefined => {
    if (Array.isArray(param)) return param[0];
    return param;
  };

  const filter = {
    subjectId: params.subjectId as string | undefined,
    status: getStatusParam(params.status),
    search: params.search as string | undefined,
  };

  const [papersData, subjects] = await Promise.all([
    fetchPapers(filter as any, page, limit),
    fetchSubjects(),
  ]);

  return (
    <PapersClient
      papers={papersData.papers}
      total={papersData.total}
      subjects={subjects}
      filter={{
        subjectId: filter.subjectId || '',
        status: filter.status || '',
        search: filter.search || '',
        page,
      }}
    />
  );
}
