import { guardStudent } from '@/lib/rbac';
import { fetchAvailablePapers, fetchStudentAttempts } from '@/app/exam/actions';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  await guardStudent();

  const [papersData, attempts] = await Promise.all([
    fetchAvailablePapers({}),
    fetchStudentAttempts(),
  ]);

  return <DashboardClient papersData={papersData} attempts={attempts} />;
}
