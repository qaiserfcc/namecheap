import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculatePriceComparison } from '@/lib/pricing';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    // Find brand
    const brand = await prisma.brand.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!brand) {
      return NextResponse.json(
        errorResponse('Brand not found'),
        { status: 404 }
      );
    }

    // Get products for this brand
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          brandId: brand.id,
          isActive: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({
        where: {
          brandId: brand.id,
          isActive: true,
        },
      }),
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
        brand,
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
    console.error('Get brand products error:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch brand products'),
      { status: 500 }
    );
  }
}
