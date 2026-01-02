import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculatePriceComparison } from '@/lib/pricing';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        errorResponse('Product not found'),
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        errorResponse('Product is not available'),
        { status: 404 }
      );
    }

    // Add price comparison
    const productWithPricing = {
      ...product,
      officialPrice: parseFloat(product.officialPrice.toString()),
      discountedPrice: parseFloat(product.discountedPrice.toString()),
      priceComparison: calculatePriceComparison(
        product.officialPrice,
        product.discountedPrice
      ),
    };

    return NextResponse.json(successResponse(productWithPricing));
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch product'),
      { status: 500 }
    );
  }
}
