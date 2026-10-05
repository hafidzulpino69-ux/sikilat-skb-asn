import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Matikan seluruh output console di client browser saat build production
    removeConsole: process.env.NODE_ENV === "production" ? true : false,
  },
};

export default nextConfig;
