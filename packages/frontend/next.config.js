
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
    trailingSlash: true,
    output: isDevelopment ? undefined : "export",
    distDir: "build",
    images: {
        unoptimized: true
    },
    ...(isDevelopment ? rewrite : {})
};


/**
 * @type {import('next-pwa').PWAConfig}
 */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: isDevelopment,
    dynamicStartUrl: true,
    sw: "/service-worker.js", 
    runtimeCaching: [
        {
            urlPattern: ({url}) => url.pathname.startsWith("/api") || url.pathname.startsWith("/auth"),
            handler: "NetworkOnly",
        },
    ]
  });


module.exports = withPWA(nextConfig); 