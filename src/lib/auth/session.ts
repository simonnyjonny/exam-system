import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const SESSION_COOKIE_NAME = 'exam_session';
const SESSION_TOKEN_LENGTH = 64; // 64 random characters
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export interface SessionData {
  userId: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'STUDENT';
}

export interface SessionError {
  code: 'EXPIRED' | 'INVALID' | 'INACTIVE';
}

function generateToken(): string {
  return randomBytes(SESSION_TOKEN_LENGTH / 2).toString('hex');
}

function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function createSession(userId: string): Promise<SessionData | null> {
  const { prisma } = await import('@/lib/prisma');

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      status: true,
    },
  });

  if (!user || user.status !== 'ACTIVE') {
    return null;
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const sessionData: SessionData = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return sessionData;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const { prisma } = await import('@/lib/prisma');

  const session = await prisma.session.findUnique({
    where: { token },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          status: true,
        },
      },
    },
  });

  if (!session || isTokenExpired(session.expiresAt)) {
    await clearSessionCookie();
    if (session) {
      await prisma.session.delete({ where: { token } }).catch(() => {});
    }
    return null;
  }

  if (session.user.status !== 'ACTIVE') {
    await clearSessionCookie();
    await prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    username: session.user.username,
    role: session.user.role,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const { prisma } = await import('@/lib/prisma');
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
