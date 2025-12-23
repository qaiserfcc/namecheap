import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order (checkout)' })
  create(@Body() dto: CreateOrderDto, @GetUser('id') userId: string) {
    return this.ordersService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiQuery({ name: 'brandId', required: false })
  findAll(
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @GetUser('brandId') userBrandId: string,
    @Query('brandId') queryBrandId?: string,
  ) {
    // Super admin sees all orders
    if (role === UserRole.SUPER_ADMIN) {
      return this.ordersService.findAll(undefined, queryBrandId, role);
    }
    
    // Brand admin/manager sees only their brand's orders
    if (role === UserRole.BRAND_ADMIN || role === UserRole.BRAND_MANAGER) {
      return this.ordersService.findAll(undefined, userBrandId, role);
    }
    
    // Customers see only their own orders
    return this.ordersService.findAll(userId, undefined, role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.BRAND_ADMIN, UserRole.WAREHOUSE)
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
