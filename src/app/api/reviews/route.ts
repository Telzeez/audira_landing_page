import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import os from "os";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { findUserById } from "@/lib/db";

interface ReviewRecord {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  date: string;
  userId: string;
}

const DB_DIR = path.join(os.tmpdir(), "audira-reviews");
const DB_FILE = path.join(DB_DIR, "reviews.json");

function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

function getReviews(): ReviewRecord[] {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read reviews database:", error);
    return [];
  }
}

function saveReviews(reviews: ReviewRecord[]): boolean {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(reviews, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Failed to write reviews database:", error);
    return false;
  }
}

export async function GET() {
  try {
    const reviews = getReviews();
    // Sort: newest first
    const sorted = [...reviews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return NextResponse.json({ success: true, reviews: sorted });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve reviews." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("audira_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { error: "You must be signed in to write a review." },
        { status: 401 },
      );
    }

    const decoded = verifyToken(sessionCookie.value);
    if (!decoded) {
      return NextResponse.json(
        { error: "Session expired or invalid." },
        { status: 401 },
      );
    }

    const user = findUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 401 });
    }

    // 2. Parse request body
    const { rating, role, quote } = await request.json();

    // 3. Validation
    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please select a rating between 1 and 5 stars." },
        { status: 400 },
      );
    }

    if (!role || typeof role !== "string" || !role.trim()) {
      return NextResponse.json(
        { error: "Profession or role is required." },
        { status: 400 },
      );
    }
    if (role.trim().length > 50) {
      return NextResponse.json(
        { error: "Profession/Role must be less than 50 characters." },
        { status: 400 },
      );
    }

    if (!quote || typeof quote !== "string" || !quote.trim()) {
      return NextResponse.json(
        { error: "Review text is required." },
        { status: 400 },
      );
    }
    if (quote.trim().length < 10) {
      return NextResponse.json(
        { error: "Review text must be at least 10 characters." },
        { status: 400 },
      );
    }
    if (quote.trim().length > 500) {
      return NextResponse.json(
        { error: "Review text must be less than 500 characters." },
        { status: 400 },
      );
    }

    // 4. Check if user already submitted a review
    const reviews = getReviews();
    const hasReviewed = reviews.some((r) => r.userId === user.id);
    if (hasReviewed) {
      return NextResponse.json(
        {
          error:
            "You have already submitted a review. Thank you for your feedback!",
        },
        { status: 400 },
      );
    }

    // 5. Alternate avatars for variety
    const imageCount = reviews.length;
    const avatarImage =
      imageCount % 2 === 0
        ? "/images/user_profile_1.png"
        : "/images/user_profile_2.png";

    // 6. Create new record
    const newId = Math.random().toString(36).substring(2, 11);
    const newReview: ReviewRecord = {
      id: newId,
      name: user.name,
      role: role.trim(),
      quote: quote.trim(),
      rating,
      image: avatarImage,
      date: new Date().toISOString(),
      userId: user.id,
    };

    reviews.push(newReview);
    const success = saveReviews(reviews);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to save review. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
