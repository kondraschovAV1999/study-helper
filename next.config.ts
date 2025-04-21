import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  transpilePackages: ["@google/genai", "uuid"],
  /* config options here */
};

export default nextConfig;
