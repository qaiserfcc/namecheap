import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';
import { verifyAccessToken, TokenPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export function authenticateRequest(request: NextRequest): TokenPayload {
  const token = getAuthToken(request);
  
  if (!token) {
    throw new Error('No authentication token provided');
  }

  try {
    return verifyAccessToken(token);
  } catch (error) {
    throw new Error('Invalid or expired authentication token');
  }
}

export function requireRole(user: TokenPayload, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
}

export function requireAdmin(user: TokenPayload): void {
  requireRole(user, [UserRole.ADMIN]);
}
