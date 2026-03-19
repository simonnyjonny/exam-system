'use server';

import { login } from '@/lib/auth/login';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await login(email, password);

  if (!result.success) {
    return { error: result.error };
  }

  if (result.role === 'ADMIN') {
    redirect('/admin');
  }

  redirect('/dashboard');
}
