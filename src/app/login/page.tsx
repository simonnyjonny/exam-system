import { guardGuest } from '@/lib/rbac';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  guardGuest();
  return <LoginForm />;
}
