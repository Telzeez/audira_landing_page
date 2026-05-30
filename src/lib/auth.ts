import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'audira-luxury-brand-secret-key-9988';

export interface PasswordHash {
  salt: string;
  hash: string;
}

export function hashPassword(password: string): PasswordHash {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return verifyHash === hash;
}

export function signToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  // Set expiration to 7 days from now
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const tokenPayload = { ...payload, exp };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');

  const baseToken = `${encodedHeader}.${encodedPayload}`;
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(baseToken)
    .digest('base64url');

  return `${baseToken}.${signature}`;
}

export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const baseToken = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(baseToken)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));

    // Check expiration
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch (error) {
    return null;
  }
}
