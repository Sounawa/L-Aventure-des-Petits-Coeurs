import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // GitHub Pages deploys to sounawa.github.io/L-Aventure-des-Petits-Coeurs
  // We need to set basePath for assets to load correctly
  basePath: process.env.NODE_ENV === 'production' ? '/L-Aventure-des-Petits-Coeurs' : '',
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "preview-chat-bc496f87-5c6b-4697-80a8-2887f34cac8c.space-z.ai",
    ".space-z.ai",
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
  ],
};

export default nextConfig;
