import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { calculatePriceComparison } from '@/lib/pricing';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const cartSchema = z.object({
  items: z.array(cartItemSchema),
});

// GET cart items with full product details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = cartSchema.parse(body);

    if (!items || items.length === 0) {
      return NextResponse.json(
        successResponse({
          items: [],
          summary: {
            subtotal: 0,
            total: 0,
            itemCount: 0,
            totalSavings: 0,
          },
        })
      );
    }

    // Get all products in cart
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
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

    // Map products with quantities and calculate totals
    const cartItems = items
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;

        const officialPrice = parseFloat(product.officialPrice.toString());
        const discountedPrice = parseFloat(product.discountedPrice.toString());
        const priceComparison = calculatePriceComparison(
          product.officialPrice,
          product.discountedPrice
        );

        return {
          product: {
            ...product,
            officialPrice,
            discountedPrice,
            priceComparison,
          },
          quantity: item.quantity,
          itemTotal: discountedPrice * item.quantity,
          itemSavings: priceComparison.savings * item.quantity,
        };
      })
      .filter(Boolean);

    // Calculate summary
    const subtotal = cartItems.reduce((sum, item) => sum + (item?.itemTotal || 0), 0);
    const totalSavings = cartItems.reduce((sum, item) => sum + (item?.itemSavings || 0), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

    return NextResponse.json(
      successResponse({
        items: cartItems,
        summary: {
          subtotal,
          total: subtotal,
          itemCount,
          totalSavings,
        },
      })
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponse('Invalid cart data: ' + error.errors[0].message),
        { status: 400 }
      );
    }

    console.error('Cart error:', error);
    return NextResponse.json(
      errorResponse('Failed to process cart'),
      { status: 500 }
    );
  }
}
