import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Allow locally uploaded images served from /uploads/
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
