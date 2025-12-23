import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('✅ Database disconnected');
  }

  // Helper method to enable brand isolation
  async enableBrandIsolation() {
    // Middleware to automatically filter by brandId
    this.$use(async (params, next) => {
      // Apply brand filtering logic here if needed
      return next(params);
    });
  }
}
