import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure packages only run on server
  serverExternalPackages: ['nodemailer', '@prisma/client', 'prisma'],
};

export default nextConfig;