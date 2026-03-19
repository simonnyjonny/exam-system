'use server';

import { createSession } from '@/lib/auth/session';

export interface LoginResult {
  success: boolean;
  error?: string;
  role?: 'ADMIN' | 'STUDENT';
}

export async function login(email: string, password: string): Promise<LoginResult> {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const { prisma } = await import('@/lib/prisma');
  const { verifyPassword } = await import('@/lib/auth/password');

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  if (user.status !== 'ACTIVE') {
    return { success: false, error: 'Account is not active' };
  }

  if (!user.passwordHash) {
    return { success: false, error: 'Invalid email or password' };
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session = await createSession(user.id);

  if (!session) {
    return { success: false, error: 'Failed to create session' };
  }

  return { success: true, role: session.role };
}
