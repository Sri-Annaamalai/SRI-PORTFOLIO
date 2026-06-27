import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: multiple lockfiles exist up the tree, so Turbopack
  // would otherwise guess the parent directory.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
