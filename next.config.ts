import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure webpack to exclude nodemailer from client-side bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Mark nodemailer as external for client-side builds
      config.externals.push('nodemailer');
    }
    return config;
  },
  // Ensure nodemailer only runs on server
  serverExternalPackages: ['nodemailer'],
};

export default nextConfig;