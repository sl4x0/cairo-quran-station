/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // No basePath needed for custom domain GitHub Pages deployment
  trailingSlash: true,
};

export default nextConfig;
