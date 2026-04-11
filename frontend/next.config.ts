import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: 'https',
        hostname: process.env.R2_HOSTNAME!,
        port: '',
        pathname: '/**',
      },
    ],
  },
  // async rewrites() {
  //   return [{
  //     source: '/api/auth/:path*',
  //     destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/:path*`,
  //   },]
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
