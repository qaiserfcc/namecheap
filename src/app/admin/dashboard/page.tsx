'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/admin');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-xl text-dark-black font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-dark-black shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <img src="/logo.svg" alt="NameCheap" className="h-12" />
              <span className="text-white font-semibold">Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-white">
                {user?.firstName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-bold text-dark-black mb-8">
          Admin <span className="text-dark-yellow">Dashboard</span>
        </h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 border-t-4 border-dark-yellow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Products</p>
                <p className="text-3xl font-bold text-dark-black">-</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          <div className="card p-6 border-t-4 border-sky-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Orders</p>
                <p className="text-3xl font-bold text-dark-black">-</p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </div>

          <div className="card p-6 border-t-4 border-dark-yellow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Revenue</p>
                <p className="text-3xl font-bold text-dark-black">PKR -</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="card p-6 border-t-4 border-sky-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Customers</p>
                <p className="text-3xl font-bold text-dark-black">-</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products */}
          <Link
            href="/admin/products"
            className="card p-8 group border-2 border-transparent hover:border-dark-yellow transition-all"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                📦
              </div>
              <h2 className="text-2xl font-bold text-dark-black mb-2 group-hover:text-dark-yellow transition-colors">Products</h2>
              <p className="text-gray-600">
                Manage your product catalog, pricing, and inventory
              </p>
            </div>
          </Link>

          {/* Orders */}
          <Link
            href="/admin/orders"
            className="card p-8 group border-2 border-transparent hover:border-sky-blue transition-all"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                🛒
              </div>
              <h2 className="text-2xl font-bold text-dark-black mb-2 group-hover:text-sky-blue transition-colors">Orders</h2>
              <p className="text-gray-600">
                View and manage customer orders and shipments
              </p>
            </div>
          </Link>

          {/* Analytics */}
          <div className="card p-8 opacity-60">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-dark-black mb-2">Analytics</h2>
              <p className="text-gray-600">
                View sales reports and analytics (Coming Soon)
              </p>
            </div>
          </div>

          {/* Feature Flags */}
          <div className="card p-8 opacity-60">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">🚩</div>
              <h2 className="text-2xl font-bold text-dark-black mb-2">Feature Flags</h2>
              <p className="text-gray-600">
                Manage platform features (Coming Soon)
              </p>
            </div>
          </div>

          {/* Users */}
          <div className="card p-8 opacity-60">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">👥</div>
              <h2 className="text-2xl font-bold text-dark-black mb-2">Users</h2>
              <p className="text-gray-600">
                Manage customer accounts (Coming Soon)
              </p>
            </div>
          </div>

          {/* Settings */}
          <div className="card p-8 opacity-60">
            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-dark-black mb-2">Settings</h2>
              <p className="text-gray-600">
                Platform configuration (Coming Soon)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 card p-6">
          <h2 className="text-2xl font-bold text-dark-black mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/products"
              className="btn-primary"
            >
              Add New Product
            </Link>
            <Link
              href="/admin/orders"
              className="btn-secondary"
            >
              View Orders
            </Link>
            <Link
              href="/"
              className="bg-dark-black text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-semibold"
            >
              View Storefront
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
