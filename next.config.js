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
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.node'],
  },
  // Exclude unnecessary files from serverless functions
  outputFileTracingExcludes: {
    '/api/**/*': [
      'node_modules/@next/swc-linux-x64-gnu',
      'node_modules/@next/swc-linux-x64-musl',
      'node_modules/@swc',
      'node_modules/sharp',
    ],
  },
  experimental: {
    // Optimize serverless functions
    serverMinification: true,
    optimizePackageImports: ['firebase-admin', '@google-cloud/firestore'],
  },
}

module.exports = nextConfig
