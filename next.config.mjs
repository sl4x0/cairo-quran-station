/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Note: Headers don't work with static export
  // Security headers should be configured in hosting platform (GitHub Pages, Vercel, etc.)
};

export default nextConfig;
