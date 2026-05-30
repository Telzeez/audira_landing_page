import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByEmail, createUser } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Check duplicate
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    // Hash password
    const { salt, hash } = hashPassword(password);

    // Save user
    const newUser = createUser({
      name,
      email,
      passwordHash: hash,
      passwordSalt: salt,
    });

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Generate session token
    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
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

    // Return safe user object (omit hashes)
    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        points: newUser.points,
        registeredDevices: newUser.registeredDevices,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
