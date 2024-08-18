const isDevelopment = process.env.NODE_ENV === "development";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

/**
 * @type {import('next-pwa').PWAConfig}
 */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDevelopment,
  dynamicStartUrl: true,
  sw: "/service-worker.js",
  runtimeCaching: [
    {
      urlPattern: ({ url }) =>
        url.pathname.startsWith("/api") || url.pathname.startsWith("/auth"),
      handler: "NetworkOnly",
    },
  ],
});

module.exports = withPWA(nextConfig);
