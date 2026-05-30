import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { findUserById } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('audira_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(sessionCookie.value);
    if (!decoded) {
      // Clear invalid cookie
      cookieStore.delete('audira_session');
      return NextResponse.json({ user: null });
    }

    const user = findUserById(decoded.id);
    if (!user) {
      cookieStore.delete('audira_session');
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        points: user.points,
        registeredDevices: user.registeredDevices,
      },
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
