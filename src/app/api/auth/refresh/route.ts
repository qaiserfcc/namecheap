import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyRefreshToken, generateTokens } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = refreshSchema.parse(body);

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Generate new tokens
    const tokens = generateTokens({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return NextResponse.json(successResponse({ tokens }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponse('Validation error'),
        { status: 400 }
      );
    }

    return NextResponse.json(
      errorResponse('Invalid refresh token'),
      { status: 401 }
    );
  }
}
