import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
      }
    ],
    // Allow locally uploaded images served from /uploads/ (legacy)
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
