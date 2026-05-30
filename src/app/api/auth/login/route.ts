import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByEmail } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordCorrect = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Generate token
    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'audira_session',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Return safe user details
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
