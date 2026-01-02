import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculatePriceComparison } from '@/lib/pricing';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
      prisma.product.count({ where }),
    ]);

    // Add price comparison to each product
    const productsWithPricing = products.map((product) => ({
      ...product,
      officialPrice: parseFloat(product.officialPrice.toString()),
      discountedPrice: parseFloat(product.discountedPrice.toString()),
      priceComparison: calculatePriceComparison(
        product.officialPrice,
        product.discountedPrice
      ),
    }));

    return NextResponse.json(
      successResponse({
        products: productsWithPricing,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch products'),
      { status: 500 }
    );
  }
}
