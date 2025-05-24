// @ts-nocheck
import withPWA from '@ducanh2912/next-pwa';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-d7d37.up.railway.app';

// PWA Configuration
const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // Remove runtimeCaching as it's not in the type definition
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['web-production-d7d37.up.railway.app'],
  },
  experimental: {
    // Server actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    return [
      // Proxy API requests to the backend
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Or specify your frontend URL in production
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

// ESLint configuration
// Apply PWA configuration with ESLint settings
export default pwaConfig({
  ...nextConfig,
  eslint: {
    ignoreDuringBuilds: true, // We're using ESLint in pre-commit hooks
  },
});
