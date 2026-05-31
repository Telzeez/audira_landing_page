import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
  points: number;
  registeredDevices: { name: string; serial: string }[];
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: number;
}

const DB_DIR = path.join(process.cwd(), "src", "data");
const DB_FILE = path.join(DB_DIR, "users.json");

// Ensure database directory and file exist
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export function getUsers(): UserRecord[] {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read users database:", error);
    return [];
  }
}

export function saveUsers(users: UserRecord[]): boolean {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Failed to write users database:", error);
    return false;
  }
}

export function findUserByEmail(email: string): UserRecord | null {
  const users = getUsers();
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  );
}

export function findUserById(id: string): UserRecord | null {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

export function createUser(
  user: Omit<UserRecord, "id" | "points" | "registeredDevices">,
): UserRecord | null {
  const users = getUsers();

  // Double-check email conflict
  if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return null;
  }

  const newUser: UserRecord = {
    ...user,
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 11),
    points: 120, // default welcome points
    registeredDevices: [
      { name: "Audira Q20", serial: "(01)01234567890123" }, // default welcome device
    ],
  };

  users.push(newUser);
  const success = saveUsers(users);
  return success ? newUser : null;
}

export function updateUser(
  id: string,
  updates: Partial<Omit<UserRecord, "id" | "email">>,
): UserRecord | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const updatedUser = {
    ...users[index],
    ...updates,
  };

  users[index] = updatedUser;
  const success = saveUsers(users);
  return success ? updatedUser : null;
}
