import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://51a65ebdc1eaad371ce3246c706e36b4@sentry.silte.fi/5',
  integrations: [nodeProfilingIntegration()],
  // Tracing
  // Capture 100% of the transactions
  tracesSampleRate: 1.0,

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  enabled: process.env.SENTRY_ENABLED_BACKEND === 'true',
});
