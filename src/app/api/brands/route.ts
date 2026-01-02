import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeProducts = searchParams.get('includeProducts') === 'true';

    const brands = await prisma.brand.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
      include: includeProducts ? {
        products: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            officialPrice: true,
            discountedPrice: true,
            stock: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      } : {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(
      successResponse({
        brands: brands.map(brand => ({
          ...brand,
          productCount: brand._count.products,
        })),
      })
    );
  } catch (error) {
    console.error('Get brands error:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch brands'),
      { status: 500 }
    );
  }
}
