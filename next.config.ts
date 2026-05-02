import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-bc496f87-5c6b-4697-80a8-2887f34cac8c.space-z.ai",
    ".space-z.ai",
  ],
};

export default nextConfig;
