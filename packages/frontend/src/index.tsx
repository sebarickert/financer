import ChartJS from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from './App';
import { ErrorBoundaryHandler } from './components/blocks/error-boundary/error-boundary';
import { LoaderSuspense } from './components/elements/loader/loader-suspense';
import { ScrollToTop } from './components/renderers/scroll-to-top/scroll-to-top';
import { SEO } from './components/renderers/seo/seo';
import { PageInfoProvider } from './context/pageInfoContext';
import { store } from './redux/store';
import { reportWebVitals } from './reportWebVitals';

import './assets/tailwind.css';

ChartJS.register(zoomPlugin);

const Root = (): JSX.Element => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundaryHandler errorPage="full-app">
          <LoaderSuspense>
            <PageInfoProvider>
              <SEO />
              <ScrollToTop />
              <App />
            </PageInfoProvider>
          </LoaderSuspense>
        </ErrorBoundaryHandler>
      </Provider>
    </React.StrictMode>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('No container found');
}
const root = createRoot(container);
root.render(<Root />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
