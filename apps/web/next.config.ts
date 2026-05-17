import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@warcraft3-guide-hub/db", "@warcraft3-guide-hub/shared"],
};

export default nextConfig;
