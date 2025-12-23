import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: string, userRole: string, userBrandId?: string) {
    // Brand isolation check
    if (userRole === UserRole.BRAND_ADMIN && dto.brandId !== userBrandId) {
      throw new ForbiddenException('Cannot create products for other brands');
    }

    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Product slug already exists');
    }

    // Validate pricing
    if (dto.discountedPrice > dto.officialPrice) {
      throw new ConflictException('Discounted price cannot be higher than official price');
    }

    return this.prisma.product.create({
      data: dto,
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
  }

  async findAll(brandId?: string, category?: string, isActive?: boolean) {
    const products = await this.prisma.product.findMany({
      where: {
        ...(brandId && { brandId }),
        ...(category && { category }),
        ...(isActive !== undefined && { isActive }),
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
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => this.calculatePriceComparison(product));
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            enableReviews: true,
          },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.calculatePriceComparison(product);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            enableReviews: true,
          },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.calculatePriceComparison(product);
  }

  async update(id: string, dto: UpdateProductDto, userId: string, userRole: string, userBrandId?: string) {
    const product = await this.findOne(id);

    // Brand isolation check
    if (userRole === UserRole.BRAND_ADMIN && product.brandId !== userBrandId) {
      throw new ForbiddenException('Cannot update products from other brands');
    }

    // Validate pricing if both are being updated
    if (dto.officialPrice && dto.discountedPrice) {
      if (dto.discountedPrice > dto.officialPrice) {
        throw new ConflictException('Discounted price cannot be higher than official price');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
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
  }

  async remove(id: string, userId: string, userRole: string, userBrandId?: string) {
    const product = await this.findOne(id);

    // Brand isolation check
    if (userRole === UserRole.BRAND_ADMIN && product.brandId !== userBrandId) {
      throw new ForbiddenException('Cannot delete products from other brands');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // SERVER-SIDE PRICE COMPARISON CALCULATION (MANDATORY)
  private calculatePriceComparison(product: any) {
    const officialPrice = Number(product.officialPrice);
    const discountedPrice = Number(product.discountedPrice);

    const savings = officialPrice - discountedPrice;
    const savingsPercentage = officialPrice > 0 ? (savings / officialPrice) * 100 : 0;

    return {
      ...product,
      officialPrice,
      discountedPrice,
      priceComparison: {
        savings: Number(savings.toFixed(2)),
        savingsPercentage: Number(savingsPercentage.toFixed(2)),
      },
    };
  }
}
