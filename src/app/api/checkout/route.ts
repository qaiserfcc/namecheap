import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const checkoutItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  shippingAddress: z.string().min(10),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        errorResponse('Unauthorized'),
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let tokenPayload;
    
    try {
      tokenPayload = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        errorResponse('Invalid or expired token'),
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { items, shippingAddress, notes } = checkoutSchema.parse(body);

    // Get all products and validate stock
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    // Validate all products exist
    if (products.length !== items.length) {
      return NextResponse.json(
        errorResponse('One or more products not found'),
        { status: 404 }
      );
    }

    // Check stock availability
    const stockIssues = items.filter(item => {
      const product = products.find(p => p.id === item.productId);
      return !product || product.stock < item.quantity;
    });

    if (stockIssues.length > 0) {
      return NextResponse.json(
        errorResponse('Insufficient stock for one or more products'),
        { status: 400 }
      );
    }

    // Calculate order total
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error('Product not found');

      const unitPrice = parseFloat(product.discountedPrice.toString());
      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
      };
    });

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: tokenPayload.userId,
          totalAmount,
          shippingAddress,
          notes: notes || null,
          status: 'PENDING',
          paymentStatus: 'PENDING',
        },
      });

      // Create order items and update product stock
      for (const item of orderItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          },
        });

        // Reduce product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Fetch complete order with items
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(
      successResponse({
        order: completeOrder,
        message: 'Order created successfully',
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

    console.error('Checkout error:', error);
    return NextResponse.json(
      errorResponse('Failed to create order'),
      { status: 500 }
    );
  }
}
