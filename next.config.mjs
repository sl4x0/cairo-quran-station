const nextConfig = {
  output: "export",

  trailingSlash: true,

  // basePath and assetPrefix not needed for root domain

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  poweredByHeader: false,
}

export default nextConfig
