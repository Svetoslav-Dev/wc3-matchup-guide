import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@warcraft3-guide-hub/db", "@warcraft3-guide-hub/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
