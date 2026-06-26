import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jumpg-assets.tokyo-cdn.com',
        pathname: '/secure/title/**',
      },
    ],
  },
};

export default nextConfig;
