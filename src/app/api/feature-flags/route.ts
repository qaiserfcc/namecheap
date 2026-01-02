import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

// GET - Get all feature flags
export async function GET(request: NextRequest) {
  try {
    const featureFlags = await prisma.featureFlag.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(successResponse(featureFlags));
  } catch (error) {
    console.error('Get feature flags error:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch feature flags'),
      { status: 500 }
    );
  }
}
