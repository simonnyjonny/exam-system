import { redirect } from 'next/navigation';
import { getSession, type SessionData } from '@/lib/auth/session';

export type UserRole = 'ADMIN' | 'STUDENT';

export async function requireRole(allowedRoles: UserRole[]): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  if (!allowedRoles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionData> {
  return requireRole(['ADMIN']);
}

export async function requireStudent(): Promise<SessionData> {
  return requireRole(['STUDENT']);
}

export async function requireAnyUser(): Promise<SessionData> {
  return requireRole(['ADMIN', 'STUDENT']);
}

export async function guardAdmin(): Promise<SessionData> {
  try {
    return await requireAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN';
    if (message === 'UNAUTHORIZED') {
      redirect('/login');
    }
    if (message === 'FORBIDDEN') {
      redirect('/dashboard');
    }
    redirect('/login');
  }
}

export async function guardStudent(): Promise<SessionData> {
  try {
    return await requireStudent();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN';
    if (message === 'UNAUTHORIZED') {
      redirect('/login');
    }
    if (message === 'FORBIDDEN') {
      redirect('/admin');
    }
    redirect('/login');
  }
}

export async function guardAnyUser(): Promise<SessionData> {
  try {
    return await requireAnyUser();
  } catch {
    redirect('/login');
  }
}

export async function guardGuest(): Promise<void> {
  const session = await getSession();
  if (session) {
    redirect(session.role === 'ADMIN' ? '/admin' : '/dashboard');
  }
}

export function isAdmin(session: SessionData | null): boolean {
  return session?.role === 'ADMIN';
}

export function isStudent(session: SessionData | null): boolean {
  return session?.role === 'STUDENT';
}
