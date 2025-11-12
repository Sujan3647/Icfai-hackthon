/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Exclude unnecessary files from serverless functions to reduce bundle size
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@next/swc-linux-x64-gnu',
      'node_modules/@next/swc-linux-x64-musl',
      'node_modules/@swc/**',
      'node_modules/sharp/**',
      'node_modules/unrs-resolver/**',
      'node_modules/@unrs/**',
      '.next/cache/**',
    ],
  },
  experimental: {
    // Optimize serverless functions
    serverMinification: true,
  },
}

module.exports = nextConfig
