import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create feature flags
  const featureFlags = [
    { key: 'cash_on_delivery', name: 'Cash on Delivery', description: 'Enable COD payment option', isEnabled: true },
    { key: 'reviews_ratings', name: 'Reviews & Ratings', description: 'Allow product reviews', isEnabled: true },
    { key: 'promotional_discounts', name: 'Promotional Discounts', description: 'Enable promotional campaigns', isEnabled: true },
    { key: 'international_shipping', name: 'International Shipping', description: 'Enable international orders', isEnabled: false },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }

  console.log('Feature flags created');

  // Create brand
  const brand = await prisma.brand.upsert({
    where: { slug: 'chiltan-pure' },
    update: {},
    create: {
      name: 'Chiltan Pure',
      slug: 'chiltan-pure',
      isActive: true,
    },
  });

  console.log('Brand created:', brand.name);

  // Create products
  const products = [
    {
      name: 'Pure Honey - 500g',
      slug: 'pure-honey-500g',
      description: 'Natural and organic honey sourced from the finest beekeepers. Rich in antioxidants and perfect for daily use.',
      officialPrice: 1500,
      discountedPrice: 1200,
      stock: 100,
      imageUrl: '/images/products/honey-500g.jpg',
    },
    {
      name: 'Organic Olive Oil - 1L',
      slug: 'organic-olive-oil-1l',
      description: 'Extra virgin olive oil pressed from premium olives. Perfect for cooking and salad dressings.',
      officialPrice: 2500,
      discountedPrice: 2000,
      stock: 50,
      imageUrl: '/images/products/olive-oil-1l.jpg',
    },
    {
      name: 'Black Seed Oil - 250ml',
      slug: 'black-seed-oil-250ml',
      description: 'Cold-pressed black seed oil with numerous health benefits. Known for its immune-boosting properties.',
      officialPrice: 1800,
      discountedPrice: 1500,
      stock: 75,
      imageUrl: '/images/products/black-seed-oil.jpg',
    },
    {
      name: 'Himalayan Pink Salt - 1kg',
      slug: 'himalayan-pink-salt-1kg',
      description: 'Pure Himalayan pink salt rich in minerals. A healthier alternative to regular table salt.',
      officialPrice: 800,
      discountedPrice: 650,
      stock: 200,
      imageUrl: '/images/products/pink-salt.jpg',
    },
    {
      name: 'Organic Dates - 500g',
      slug: 'organic-dates-500g',
      description: 'Premium quality organic dates. Naturally sweet and packed with nutrients.',
      officialPrice: 1200,
      discountedPrice: 950,
      stock: 150,
      imageUrl: '/images/products/dates.jpg',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        brandId: brand.id,
      },
    });
  }

  console.log('Products created');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@chiltanpure.com' },
    update: {},
    create: {
      email: 'admin@chiltanpure.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  console.log('Admin user created:', adminUser.email);

  // Create sample buyer user
  const buyerPassword = await bcrypt.hash('buyer123', 10);
  const buyerUser = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      password: buyerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.BUYER,
    },
  });

  console.log('Buyer user created:', buyerUser.email);
  console.log('Seed completed!');
  console.log('\n=== Login Credentials ===');
  console.log('Admin: admin@chiltanpure.com / admin123');
  console.log('Buyer: buyer@example.com / buyer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
