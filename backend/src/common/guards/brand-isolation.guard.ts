import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class BrandIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestedBrandId = request.params.brandId || request.body.brandId || request.query.brandId;

    // Super admin can access all brands
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Customers can browse all brands
    if (user.role === UserRole.CUSTOMER) {
      return true;
    }

    // Brand-specific roles must match the brand
    if (
      user.role === UserRole.BRAND_ADMIN ||
      user.role === UserRole.BRAND_MANAGER ||
      user.role === UserRole.FINANCE ||
      user.role === UserRole.WAREHOUSE
    ) {
      if (!user.brandId) {
        throw new ForbiddenException('User is not associated with any brand');
      }

      if (requestedBrandId && user.brandId !== requestedBrandId) {
        throw new ForbiddenException('Access denied to this brand');
      }

      return true;
    }

    return false;
  }
}
