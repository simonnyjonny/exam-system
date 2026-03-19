import { guardAdmin } from '@/lib/rbac';
import { StudentsClient } from './students-client';

export default async function AdminStudentsPage() {
  const session = await guardAdmin();
  return <StudentsClient username={session.username} />;
}
