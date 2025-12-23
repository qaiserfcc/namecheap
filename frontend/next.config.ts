import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['example.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
};

export default nextConfig;
