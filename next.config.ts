import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
      {
         protocol: "https",
         hostname: "wry-hog-195.convex.cloud", // Explicitly adding potential convex domain if wildcard fails or is insufficient
      }
    ],
  },
};

export default nextConfig;
