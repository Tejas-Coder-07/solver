import { NextRequest, NextResponse } from 'next/server';
import type { UserRole } from '@/types';

const cookieName = 'gardenia_demo_session';
const demoRoles: readonly UserRole[] = ['STUDENT', 'RESEARCHER', 'MENTOR', 'SPONSOR', 'ADMIN'];

function isDemoRole(value: unknown): value is UserRole {
  return typeof value === 'string' && demoRoles.includes(value as UserRole);
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Demo preview is available only in development.' }, { status: 404 });
  }

  const value = request.cookies.get(cookieName)?.value;
  const separator = value?.indexOf('|') ?? -1;
  if (!value || separator < 0) return NextResponse.json({ session: null });

  const role = value.slice(0, separator);
  let email: string;
  try {
    email = decodeURIComponent(value.slice(separator + 1));
  } catch {
    return NextResponse.json({ session: null });
  }
  if (!isDemoRole(role) || !isEmail(email)) return NextResponse.json({ session: null });

  return NextResponse.json({ session: { email, role } });
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Demo preview is available only in development.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'A valid email and demo role are required.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || !('email' in body) || !('role' in body)) {
    return NextResponse.json({ error: 'A valid email and demo role are required.' }, { status: 400 });
  }
  const { email, role } = body as { email: unknown; role: unknown };
  if (!isEmail(email) || !isDemoRole(role)) {
    return NextResponse.json({ error: 'Enter a valid email and choose an available demo role.' }, { status: 400 });
  }

  const response = NextResponse.json({ session: { email: email.trim(), role } });
  response.cookies.set(cookieName, `${role}|${encodeURIComponent(email.trim())}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Demo preview is available only in development.' }, { status: 404 });
  }
  const response = NextResponse.json({ session: null });
  response.cookies.set(cookieName, '', { httpOnly: true, sameSite: 'lax', secure: false, path: '/', maxAge: 0 });
  return response;
}

function isEmail(value: unknown): value is string {
  return typeof value === 'string'
    && value.trim().length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
