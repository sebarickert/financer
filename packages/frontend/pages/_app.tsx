import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';

import { useAuthGetAuthenticationStatusQuery } from '$api/generated/financerApi';
import { ErrorBoundaryHandler } from '$blocks/error-boundary/error-boundary';
import { TransitionProvider } from '$container/transition.provider';
import { Loader } from '$elements/loader/loader';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { Notification } from '$elements/notification/notification';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { Layout } from '$layouts/layout/layout';
import { Login } from '$pages/login/login';
import { ScrollToTop } from '$renderers/scroll-to-top/scroll-to-top';
import { SEO } from '$renderers/seo/seo';
import { PageInfoProvider } from 'src/context/pageInfoContext';
import { store } from 'src/redux/store';

import '../src/assets/tailwind.css';

const PUBLIC_ROUTES = ['/privacy-policy', '/issues-with-login'];

const App = ({ Component, pageProps }: AppProps) => {
  const { data: authenticationStatus, isLoading } =
    useAuthGetAuthenticationStatusQuery();
  const { push, pathname } = useViewTransitionRouter();

  const [isOnboardingVisible, setOnboardingVisible] = useState(false);

  useEffect(() => {
    if (
      !authenticationStatus?.authenticated ||
      authenticationStatus?.hasAccounts ||
      isOnboardingVisible
    ) {
      return;
    }

    setOnboardingVisible(true);
    push('/accounts/add');
  }, [push, isOnboardingVisible, authenticationStatus]);

  if (isLoading) return <Loader />;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const errors = authenticationStatus?.errors;
  const isAuthenticated = authenticationStatus?.authenticated;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return (
    <>
      {errors && (
        <Notification type="error" label="Something went wrong!">
          {errors.join(' ') || ''}
        </Notification>
      )}
      {isOnboardingVisible && (
        <Notification type={'success'} label={'Welcome to Financer!'}>
          Please add your first account before you start tracking finances with
          Financer.
        </Notification>
      )}
      {isPublicRoute && <Component {...pageProps} />}
      {isAuthenticated && !isPublicRoute && (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      {!isPublicRoute && !isAuthenticated && <Login />}
    </>
  );
};

const AppWrapper = (props: AppProps) => {
  return (
    <Provider store={store}>
      <ErrorBoundaryHandler errorPage="full-app">
        <TransitionProvider>
          <LoaderSuspense>
            <PageInfoProvider>
              <SEO />
              <ScrollToTop />
              <App {...props} />
            </PageInfoProvider>
          </LoaderSuspense>
        </TransitionProvider>
      </ErrorBoundaryHandler>
    </Provider>
  );
};

export default AppWrapper;
