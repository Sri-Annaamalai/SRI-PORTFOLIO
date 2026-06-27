import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: multiple lockfiles exist up the tree, so Turbopack
  // would otherwise guess the parent directory.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
};

export default nextConfig;
