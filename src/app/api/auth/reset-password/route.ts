import { NextResponse } from "next/server";
import { findUserByEmail, updateUser } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: "Email, reset token, and new password are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid reset credentials." },
        { status: 400 },
      );
    }

    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== token ||
      !user.passwordResetTokenExpiresAt ||
      Date.now() > user.passwordResetTokenExpiresAt
    ) {
      return NextResponse.json(
        { error: "Reset token is invalid or has expired." },
        { status: 400 },
      );
    }

    const { salt, hash } = hashPassword(newPassword);

    const updatedUser = updateUser(user.id, {
      passwordHash: hash,
      passwordSalt: salt,
      passwordResetToken: undefined,
      passwordResetTokenExpiresAt: undefined,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Unable to reset password. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
