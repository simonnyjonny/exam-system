import { guardAdmin } from '@/lib/rbac';
import { logoutAction } from '@/app/logout/actions';
import { AdminDashboardClient } from './admin-dashboard-client';

export default async function AdminPage() {
  const session = await guardAdmin();
  return <AdminDashboardClient username={session.username} />;
}
