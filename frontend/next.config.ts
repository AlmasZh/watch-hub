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
    ],
  },
  async rewrites() {
    return [
      {
        // This is your local 'fake' path
        source: "/video-proxy/:path*",
        // This is the real CloudFront destination
        destination: "https://d24lanzu8wxnoe.cloudfront.net/:path*",
      },
    ];
  },
};

export default nextConfig;
