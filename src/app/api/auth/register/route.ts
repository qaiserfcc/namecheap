import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateTokens } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { UserRole } from '@prisma/client';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.BUYER),
  adminSecret: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, role, adminSecret } = registerSchema.parse(body);

    const targetRole = role ?? UserRole.BUYER;

    if (targetRole === UserRole.ADMIN) {
      const expectedSecret = process.env.ADMIN_REGISTRATION_SECRET;
      if (!expectedSecret) {
        return NextResponse.json(
          errorResponse('Admin registration is disabled'),
          { status: 403 }
        );
      }

      if (adminSecret !== expectedSecret) {
        return NextResponse.json(
          errorResponse('Invalid admin registration secret'),
          { status: 403 }
        );
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        errorResponse('User already exists'),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: targetRole,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      successResponse({
        user,
        tokens,
      }),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponse('Validation error: ' + error.errors[0].message),
        { status: 400 }
      );
    }

    console.error('Register error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
