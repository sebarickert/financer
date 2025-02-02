const isDevelopment = process.env.NODE_ENV === "development";

// Enable eslint and typescript validation by default
const nextBuildIgnoreEslint = process.env.NEXT_BUILD_IGNORE_ESLINT === "true";
const nextBuildIgnoreTypescript =
  process.env.NEXT_BUILD_IGNORE_TYPESCRIPT === "true";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: nextBuildIgnoreEslint,
  },
  typescript: {
    ignoreBuildErrors: nextBuildIgnoreTypescript,
  },
  reactStrictMode: true,
  trailingSlash: true,
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

if (isDevelopment) {
  // next-pwa has some webpack configs that throws warnings with turbopack.
  // We don't want to enable sentry in the development mode.
  module.exports = nextConfig;
} else {
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

  module.exports = withSentryConfig(module.exports, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "silte",
    project: "financer-frontend",
    sentryUrl: "https://sentry.silte.fi",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    sourcemaps: {
      disable: process.env.SENTRY_UPLOAD_SOURCEMAPS_FRONTEND !== "true",
    },

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: false,
  });
}
