import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authenticateRequest, requireAdmin } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  officialPrice: z.number().positive(),
  discountedPrice: z.number().positive(),
  stock: z.number().int().min(0),
  imageUrl: z.string().optional(),
  brandId: z.string().uuid(),
});

const updateProductSchema = createProductSchema.partial();

// GET - List all products (admin view)
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    requireAdmin(user);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.product.count(),
    ]);

    const productsFormatted = products.map((p) => ({
      ...p,
      officialPrice: parseFloat(p.officialPrice.toString()),
      discountedPrice: parseFloat(p.discountedPrice.toString()),
    }));

    return NextResponse.json(
      successResponse({
        products: productsFormatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error: any) {
    console.error('Admin get products error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to fetch products'),
      { status: error.message === 'Insufficient permissions' ? 403 : 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    requireAdmin(user);

    const body = await request.json();
    const data = createProductSchema.parse(body);

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        errorResponse('Product with this slug already exists'),
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        officialPrice: data.officialPrice,
        discountedPrice: data.discountedPrice,
      },
      include: {
        brand: true,
      },
    });

    return NextResponse.json(
      successResponse({
        ...product,
        officialPrice: parseFloat(product.officialPrice.toString()),
        discountedPrice: parseFloat(product.discountedPrice.toString()),
      }),
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponse('Validation error: ' + error.errors[0].message),
        { status: 400 }
      );
    }

    console.error('Create product error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to create product'),
      { status: error.message === 'Insufficient permissions' ? 403 : 500 }
    );
  }
}
