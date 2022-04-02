import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import { App } from './App';
import './assets/tailwind.css';
import { ScrollToTop } from './components/scroll-to-top/scroll-to-top';
import { SEO } from './components/seo/seo';
import { PageInfoProvider } from './context/pageInfoContext';
import { reportWebVitals } from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { isUpdateAllowed } from './utils/allowedUpdateLocations';

const queryClient = new QueryClient();

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
        <PageInfoProvider>
          <SEO />
          <ScrollToTop />
          <App />
        </PageInfoProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(
  <Router>
    <Root />
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
