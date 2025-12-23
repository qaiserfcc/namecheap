import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (optional - be careful in production)
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.brand.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Brands
  const chiltanPure = await prisma.brand.create({
    data: {
      name: 'Chiltan Pure',
      slug: 'chiltan-pure',
      description: 'Natural and organic health & beauty products',
      isActive: true,
      enableCOD: true,
      enableSubscriptions: true,
      enableLoyaltyPoints: true,
      enableInternationalShip: true,
      enableReviews: true,
      metaTitle: 'Chiltan Pure - Natural & Organic Products',
      metaDescription: 'Shop premium natural and organic health and beauty products at discounted prices',
      metaKeywords: 'natural, organic, health, beauty, skincare',
    },
  });

  const brandX = await prisma.brand.create({
    data: {
      name: 'Brand X',
      slug: 'brand-x',
      description: 'Premium lifestyle products',
      isActive: true,
      enableCOD: true,
      enableReviews: true,
      metaTitle: 'Brand X - Premium Lifestyle Products',
      metaDescription: 'Discover premium lifestyle products at competitive prices',
    },
  });

  console.log('✅ Created brands:', chiltanPure.name, brandX.name);

  // Create Super Admin
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  // Create Brand Admin for Chiltan Pure
  const chiltanAdmin = await prisma.user.create({
    data: {
      email: 'admin@chiltanpure.com',
      password: hashedPassword,
      firstName: 'Chiltan',
      lastName: 'Admin',
      role: UserRole.BRAND_ADMIN,
      brandId: chiltanPure.id,
      isActive: true,
    },
  });

  // Create Brand Admin for Brand X
  const brandXAdmin = await prisma.user.create({
    data: {
      email: 'admin@brandx.com',
      password: hashedPassword,
      firstName: 'Brand X',
      lastName: 'Admin',
      role: UserRole.BRAND_ADMIN,
      brandId: brandX.id,
      isActive: true,
    },
  });

  // Create a Customer
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.CUSTOMER,
      phone: '+1234567890',
      isActive: true,
    },
  });

  console.log('✅ Created users: Super Admin, Brand Admins, Customer');

  // Create Products for Chiltan Pure
  const chiltanProducts = await Promise.all([
    prisma.product.create({
      data: {
        brandId: chiltanPure.id,
        name: 'Organic Argan Oil',
        slug: 'organic-argan-oil',
        description: 'Pure organic argan oil for hair and skin',
        officialPrice: 2500,
        discountedPrice: 1999,
        stock: 100,
        sku: 'CP-ARG-001',
        images: [
          'https://example.com/argan-oil-1.jpg',
          'https://example.com/argan-oil-2.jpg',
        ],
        category: 'Hair Care',
        tags: ['organic', 'argan', 'hair', 'skin'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'Organic Argan Oil - Chiltan Pure',
        metaDescription: 'Premium organic argan oil for healthy hair and glowing skin',
      },
    }),
    prisma.product.create({
      data: {
        brandId: chiltanPure.id,
        name: 'Natural Rose Water',
        slug: 'natural-rose-water',
        description: 'Pure natural rose water toner',
        officialPrice: 1200,
        discountedPrice: 899,
        stock: 150,
        sku: 'CP-ROS-001',
        images: ['https://example.com/rose-water.jpg'],
        category: 'Skin Care',
        tags: ['natural', 'rose', 'toner', 'skincare'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'Natural Rose Water - Chiltan Pure',
        metaDescription: 'Pure natural rose water for fresh and healthy skin',
      },
    }),
    prisma.product.create({
      data: {
        brandId: chiltanPure.id,
        name: 'Organic Coconut Oil',
        slug: 'organic-coconut-oil',
        description: 'Cold-pressed organic coconut oil',
        officialPrice: 1800,
        discountedPrice: 1499,
        stock: 80,
        sku: 'CP-COC-001',
        images: ['https://example.com/coconut-oil.jpg'],
        category: 'Hair Care',
        tags: ['organic', 'coconut', 'oil', 'hair'],
        isActive: true,
        metaTitle: 'Organic Coconut Oil - Chiltan Pure',
        metaDescription: 'Premium cold-pressed organic coconut oil',
      },
    }),
  ]);

  // Create Products for Brand X
  const brandXProducts = await Promise.all([
    prisma.product.create({
      data: {
        brandId: brandX.id,
        name: 'Premium Watch',
        slug: 'premium-watch',
        description: 'Luxury timepiece with elegant design',
        officialPrice: 15000,
        discountedPrice: 12999,
        stock: 25,
        sku: 'BX-WAT-001',
        images: ['https://example.com/watch-1.jpg'],
        category: 'Accessories',
        tags: ['watch', 'luxury', 'premium'],
        isActive: true,
        isFeatured: true,
        metaTitle: 'Premium Watch - Brand X',
        metaDescription: 'Elegant luxury timepiece for the discerning customer',
      },
    }),
    prisma.product.create({
      data: {
        brandId: brandX.id,
        name: 'Designer Sunglasses',
        slug: 'designer-sunglasses',
        description: 'Stylish designer sunglasses with UV protection',
        officialPrice: 5000,
        discountedPrice: 3999,
        stock: 50,
        sku: 'BX-SUN-001',
        images: ['https://example.com/sunglasses.jpg'],
        category: 'Accessories',
        tags: ['sunglasses', 'designer', 'fashion'],
        isActive: true,
        metaTitle: 'Designer Sunglasses - Brand X',
        metaDescription: 'Stylish UV protection sunglasses',
      },
    }),
  ]);

  console.log(
    '✅ Created products:',
    chiltanProducts.length + brandXProducts.length,
  );

  // Create sample address for customer
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      addressLine1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      isDefault: true,
    },
  });

  console.log('✅ Created sample address');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('Super Admin: admin@ecommerce.com / Admin@123');
  console.log('Chiltan Pure Admin: admin@chiltanpure.com / Admin@123');
  console.log('Brand X Admin: admin@brandx.com / Admin@123');
  console.log('Customer: customer@example.com / Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
