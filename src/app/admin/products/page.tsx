'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  officialPrice: number;
  discountedPrice: number;
  stock: number;
  isActive: boolean;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/products/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      setProducts(result.data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <Link href="/admin/products" className="text-dark-yellow font-semibold">
                Products
              </Link>
              <Link href="/admin/orders" className="text-white hover:text-dark-yellow transition-colors font-medium">
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-dark-black">
            Product <span className="text-dark-yellow">Management</span>
          </h1>
          <button className="btn-primary">
            + Add New Product
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-dark-yellow/20 to-sky-blue/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-dark-black uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-dark-black uppercase tracking-wider">
                  Official Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-dark-black uppercase tracking-wider">
                  Discounted Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-dark-black uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-dark-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-dark-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-dark-black">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      PKR {product.officialPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-yellow font-bold">
                      PKR {product.discountedPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-dark-black font-semibold">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-sky-blue text-white">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-300 text-gray-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-sky-blue hover:text-secondary-dark font-semibold mr-4 transition-colors">Edit</button>
                      <button className="text-red-600 hover:text-red-800 font-semibold transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-gradient-to-r from-sky-blue/10 to-dark-yellow/10 border-2 border-sky-blue/30 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-dark-black">Note:</strong> Product creation and editing forms will be available in the full implementation.
            Currently showing products fetched from the database.
          </p>
        </div>
      </main>
    </div>
  );
}
