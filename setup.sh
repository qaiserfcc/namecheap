#!/bin/bash

echo "🚀 Multi-Brand E-commerce Platform - Setup Script"
echo "=================================================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Check npm
NPM_VERSION=$(npm -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $NPM_VERSION"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
echo "------------------------"
cd backend || exit 1

if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database URL before proceeding."
    echo ""
fi

echo "Installing backend dependencies..."
npm install

echo "Generating Prisma Client..."
npm run prisma:generate

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
echo "------------------------"
cd ../frontend || exit 1

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
fi

echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

cd ..

echo "=================================================="
echo "🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Neon database URL"
echo "2. Run database migrations:"
echo "   cd backend && npm run prisma:migrate"
echo "3. Seed the database:"
echo "   npm run db:seed"
echo "4. Start the backend:"
echo "   npm run start:dev"
echo "5. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "Access the application:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001/api"
echo "- API Docs: http://localhost:3001/api/docs"
echo ""
echo "Default login credentials (after seeding):"
echo "- Super Admin: admin@ecommerce.com / Admin@123"
echo "- Brand Admin: admin@chiltanpure.com / Admin@123"
echo "- Customer: customer@example.com / Admin@123"
echo ""
