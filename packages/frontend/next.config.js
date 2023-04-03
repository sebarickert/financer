/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    rewrites: async () => [{ source: '/auth/:path*', destination: '/api/:path*' }],
};



module.exports = nextConfig;