import ChartJS from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import { App } from './App';
import { ErrorBoundaryHandler } from './components/blocks/error-boundary/error-boundary';
import { LoaderSuspense } from './components/elements/loader/loader-suspense';
import { ScrollToTop } from './components/renderers/scroll-to-top/scroll-to-top';
import { SEO } from './components/renderers/seo/seo';
import { PageInfoProvider } from './context/pageInfoContext';
import { reportWebVitals } from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { isUpdateAllowed } from './utils/allowedUpdateLocations';

import './assets/tailwind.css';

ChartJS.register(zoomPlugin);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      staleTime: 300000,
    },
  },
});

const Root = (): JSX.Element => {
  const { pathname } = useLocation();
  const [isAppUpdateAvailable, setIsAppUpdateAvailable] = useState(false);

  useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: (registration) => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          waitingServiceWorker.addEventListener('statechange', (event: any) => {
            if (event?.target?.state === 'activated') {
              setIsAppUpdateAvailable(true);
            }
          });
          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
      },
    });
  }, []);

  useEffect(() => {
    if (isAppUpdateAvailable && isUpdateAllowed(pathname)) {
      window.location.reload();
    }
  }, [isAppUpdateAvailable, pathname]);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundaryHandler errorPage="full-app">
          <LoaderSuspense>
            <PageInfoProvider>
              <SEO />
              <ScrollToTop />
              <App />
            </PageInfoProvider>
          </LoaderSuspense>
        </ErrorBoundaryHandler>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('No container found');
}
const root = createRoot(container);
root.render(
  <Router>
    <Root />
  </Router>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
