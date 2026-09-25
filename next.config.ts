import type { NextConfig } from "next";

// Deployed as static files to GitHub Pages (https://eunkyo3.github.io), so no Node server at runtime.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
