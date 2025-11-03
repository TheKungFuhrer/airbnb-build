/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com", "ui-avatars.com"],
  },
  // Disable static export for dynamic pages that use authentication
  output: undefined,
};

module.exports = nextConfig;
