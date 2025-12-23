import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: string) {
    // Validate brand exists
    const brand = await this.prisma.brand.findUnique({
      where: { id: dto.brandId },
    });

    if (!brand || !brand.isActive) {
      throw new NotFoundException('Brand not found or inactive');
    }

    // Validate address belongs to user
    const address = await this.prisma.address.findFirst({
      where: {
        id: dto.addressId,
        userId: userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    // Validate all products and calculate totals
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        brandId: dto.brandId,
        isActive: true,
      },
    });

    if (products.length !== dto.items.length) {
      throw new BadRequestException('Some products are invalid or from different brand');
    }

    // Check stock availability
    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const itemSubtotal = Number(product.discountedPrice) * item.quantity;
      subtotal += itemSubtotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        officialPrice: product.officialPrice,
        discountedPrice: product.discountedPrice,
        subtotal: itemSubtotal,
      };
    });

    const tax = subtotal * 0.0; // Configure tax rate as needed
    const shippingCost = 0; // Configure shipping logic as needed
    const total = subtotal + tax + shippingCost;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order in transaction
    return this.prisma.$transaction(async (prisma) => {
      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          brandId: dto.brandId,
          addressId: dto.addressId,
          subtotal,
          tax,
          shippingCost,
          total,
          paymentMethod: dto.paymentMethod,
          notes: dto.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
          address: true,
          brand: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });

      // Update product stock
      for (const item of dto.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });
  }

  async findAll(userId?: string, brandId?: string, role?: string) {
    return this.prisma.order.findMany({
      where: {
        ...(userId && { userId }),
        ...(brandId && { brandId }),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        address: true,
        brand: {
          select: {
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        address: true,
        brand: {
          select: {
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        items: true,
        address: true,
        brand: true,
      },
    });
  }
}
