import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['storage.googleapis.com'], // Add your allowed domains here
  },
};

export default nextConfig;
