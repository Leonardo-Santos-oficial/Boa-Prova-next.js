import type { NextConfig } from "next";
import { getRedirects } from './lib/redirects';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['boa-prova.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return getRedirects()
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },
};

export default nextConfig;
