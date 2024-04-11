/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    remotePatterns: [
      {
        hostname: "books.google.com",
      },
    ],
  },
};

export default nextConfig;
