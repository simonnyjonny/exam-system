import { guardAdmin } from '@/lib/rbac';
import { notFound } from 'next/navigation';
import { fetchPaperForEdit, fetchSubjects } from '../actions';
import { EditPaperClient } from './edit-paper-client';

export default async function EditPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardAdmin();
  const { id } = await params;

  const [paper, subjects] = await Promise.all([
    fetchPaperForEdit(id),
    fetchSubjects(),
  ]);

  if (!paper) {
    notFound();
  }

  return <EditPaperClient paperId={id} paper={paper} subjects={subjects} />;
}
