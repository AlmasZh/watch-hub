import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: process.env.NEXT_PUBLIC_IMAGES_CLOUDFRONT_URL!,
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/video-proxy/:path*",
        destination: process.env.NEXT_PUBLIC_CLOUDFRONT_URL!,
      },
    ];
  },
};

export default nextConfig;
