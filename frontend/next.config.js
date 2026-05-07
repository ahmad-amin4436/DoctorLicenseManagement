/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5039/api/:path*', // Proxy to API
      }
    ]
  }
}

module.exports = nextConfig
