'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
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
            <div className="flex items-center gap-6">
              <Link href="/admin/dashboard" className="text-white hover:text-dark-yellow transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/admin/products" className="text-white hover:text-dark-yellow transition-colors font-medium">
                Products
              </Link>
              <Link href="/admin/orders" className="text-dark-yellow font-semibold">
                Orders
              </Link>
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
          Order <span className="text-dark-yellow">Management</span>
        </h1>

        <div className="card p-12 text-center border-t-4 border-sky-blue">
          <div className="text-7xl mb-6">🛒</div>
          <p className="text-2xl text-dark-black font-semibold mb-4">No orders yet</p>
          <p className="text-gray-500 text-lg">
            Orders placed by customers will appear here
          </p>
        </div>

        <div className="mt-6 bg-gradient-to-r from-sky-blue/10 to-dark-yellow/10 border-2 border-sky-blue/30 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-dark-black">Note:</strong> This page will display all customer orders with options to:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-2">
            <li>View order details</li>
            <li>Update order status (Pending → Confirmed → Processing → Shipped → Delivered)</li>
            <li>Update payment status</li>
            <li>Filter by status, date, customer</li>
            <li>Export orders for reporting</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
