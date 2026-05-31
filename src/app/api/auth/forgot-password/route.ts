import { NextResponse } from "next/server";
import { findUserByEmail, updateUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      // Do not reveal whether the user exists.
      return NextResponse.json({ success: true });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    const updatedUser = updateUser(user.id, {
      passwordResetToken: resetToken,
      passwordResetTokenExpiresAt: expiresAt,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Unable to generate password reset token." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, resetToken });
  } catch (error) {
    console.error("Forgot password route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
