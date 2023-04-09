
const isDevelopment = process.env.NODE_ENV === "development"

/**
 * @type {import('next').NextConfig}
 */
const rewrite = {
    rewrites: async () => [{ source: '/auth/:path*', destination: '/api/:path*' }],
 }

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
    output: isDevelopment ? undefined : "export",
    distDir: "build",
    ...(isDevelopment ? rewrite : {})
};


module.exports = nextConfig; 