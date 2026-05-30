import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { findUserById, updateUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { deviceName, serial } = await request.json();

    if (!deviceName || !serial) {
      return NextResponse.json(
        { error: 'Device name and serial number are required.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('audira_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(sessionCookie.value);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized. Session expired.' },
        { status: 401 }
      );
    }

    const user = findUserById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Check duplicate serial
    const isAlreadyRegistered = user.registeredDevices.some(
      (d) => d.serial.toLowerCase() === serial.trim().toLowerCase()
    );
    if (isAlreadyRegistered) {
      return NextResponse.json(
        { error: 'This device is already registered under your account.' },
        { status: 400 }
      );
    }

    // Add device and increment points by 50
    const updatedDevices = [...user.registeredDevices, { name: deviceName, serial: serial.trim() }];
    const updatedPoints = user.points + 50;

    const updatedUser = updateUser(user.id, {
      registeredDevices: updatedDevices,
      points: updatedPoints,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to register device. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registeredDevices: updatedUser.registeredDevices,
      points: updatedUser.points,
    });
  } catch (error) {
    console.error('Device registration route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
