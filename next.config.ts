import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 serverExternalPackages: ["pdf-parse"],
  transpilePackages: ["@google/genai", "uuid"],
  /* config options here */
};


export default nextConfig;
