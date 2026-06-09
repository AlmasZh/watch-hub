import type { NextConfig } from "next";

const imagesHostName = (process.env.NEXT_PUBLIC_IMAGES_CLOUDFRONT_URL || "cdn.example.com").replace(/^https?:\/\//, "")
const rewriteDestination = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || "https://cdn.example.com/:path"

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: imagesHostName,
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/video-proxy/:path*",
        destination: rewriteDestination,
      },
    ];
  },
};

export default nextConfig;
