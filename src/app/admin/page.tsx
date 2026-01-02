'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Store tokens
      localStorage.setItem('accessToken', result.data.tokens.accessToken);
      localStorage.setItem('refreshToken', result.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      // Check if admin
      if (result.data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/account');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue/20 via-white to-dark-yellow/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img src="/logo.svg" alt="NameCheap" className="h-16 mx-auto" />
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-dark-black">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-dark-yellow">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-dark-black mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-yellow focus:border-dark-yellow transition-all"
                placeholder="admin@namecheap.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-dark-black mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-yellow focus:border-dark-yellow transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 bg-gradient-to-r from-sky-blue/10 to-dark-yellow/10 border-2 border-sky-blue/30 rounded-lg p-4">
            <p className="text-sm font-bold text-dark-black mb-2">Demo Credentials:</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Admin:</strong> admin@namecheap.com / admin123</p>
              <p><strong>Buyer:</strong> buyer@namecheap.com / buyer123</p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center text-sm">
            <Link href="/" className="text-sky-blue hover:text-[#0EA5E9] font-semibold transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
