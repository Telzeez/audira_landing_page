import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '@/lib/auth';

interface OrderRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  date: string;
}

const DB_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE = path.join(DB_DIR, 'orders.json');

// Ensure orders database exists
function initDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function getOrders(): OrderRecord[] {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read orders database:', error);
    return [];
  }
}

function saveOrders(orders: OrderRecord[]): boolean {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Failed to write orders database:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, address, items, subtotal } = await request.json();

    if (!name || !email || !address || !items || items.length === 0 || !subtotal) {
      return NextResponse.json(
        { error: 'Name, email, shipping address, and cart items are required.' },
        { status: 400 }
      );
    }

    // Authenticate if user has active session
    let userId = 'guest';
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('audira_session');
    if (sessionCookie && sessionCookie.value) {
      const decoded = verifyToken(sessionCookie.value);
      if (decoded) {
        userId = decoded.id;
      }
    }

    // Generate Order Reference
    const orderNum = Math.floor(10000 + Math.random() * 90000); // 5 digits
    const orderRef = `AUD-ORD-${orderNum}`;

    const newOrder: OrderRecord = {
      id: orderRef,
      userId,
      name,
      email,
      address,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      date: new Date().toISOString(),
    };

    // Save order record to database
    const orders = getOrders();
    orders.push(newOrder);
    const success = saveOrders(orders);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to record checkout order. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderRef: newOrder.id,
      order: newOrder,
    });
  } catch (error) {
    console.error('Checkout route error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
