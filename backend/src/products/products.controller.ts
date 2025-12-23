import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { BrandIsolationGuard } from '../common/guards/brand-isolation.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard, BrandIsolationGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.BRAND_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  create(
    @Body() dto: CreateProductDto,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @GetUser('brandId') brandId?: string,
  ) {
    return this.productsService.create(dto, userId, role, brandId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with price comparison' })
  @ApiQuery({ name: 'brandId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(
    @Query('brandId') brandId?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
  ) {
    const active = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.productsService.findAll(brandId, category, active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID with price comparison' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug with price comparison' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, BrandIsolationGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.BRAND_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @GetUser('brandId') brandId?: string,
  ) {
    return this.productsService.update(id, dto, userId, role, brandId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard, BrandIsolationGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.BRAND_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  remove(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @GetUser('brandId') brandId?: string,
  ) {
    return this.productsService.remove(id, userId, role, brandId);
  }
}
