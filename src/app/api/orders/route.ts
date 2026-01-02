import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { OrderStatus, PaymentStatus } from '@prisma/client';

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingAddress: z.string().min(10),
  notes: z.string().optional(),
});

// GET - List user's orders
export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
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
      },
    });

    const ordersFormatted = orders.map((order) => ({
      ...order,
      totalAmount: parseFloat(order.totalAmount.toString()),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice.toString()),
        totalPrice: parseFloat(item.totalPrice.toString()),
      })),
    }));

    return NextResponse.json(successResponse(ordersFormatted));
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to fetch orders'),
      { status: error.message.includes('token') ? 401 : 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    const body = await request.json();
    const { items, shippingAddress, notes } = createOrderSchema.parse(body);

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItemsData: Array<{
      productId: string;
      quantity: number;
      unitPrice: any;
      totalPrice: number;
    }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          errorResponse(`Product ${item.productId} not found`),
          { status: 400 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          errorResponse(`Product ${product.name} is not available`),
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          errorResponse(`Insufficient stock for ${product.name}`),
          { status: 400 }
        );
      }

      const itemTotal = parseFloat(product.discountedPrice.toString()) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.discountedPrice,
        totalPrice: itemTotal,
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          totalAmount,
          shippingAddress,
          notes,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stock
      for (const item of items) {
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

    const orderFormatted = {
      ...order,
      totalAmount: parseFloat(order.totalAmount.toString()),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        unitPrice: parseFloat(item.unitPrice.toString()),
        totalPrice: parseFloat(item.totalPrice.toString()),
      })),
    };

    return NextResponse.json(
      successResponse(orderFormatted),
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        errorResponse('Validation error: ' + error.errors[0].message),
        { status: 400 }
      );
    }

    console.error('Create order error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Failed to create order'),
      { status: error.message.includes('token') ? 401 : 500 }
    );
  }
}
