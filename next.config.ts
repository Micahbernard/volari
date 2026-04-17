import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack root to this package. Without it, Next can detect a parent
  // lockfile and watch too much — stale dev state and workspace-root warnings.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
