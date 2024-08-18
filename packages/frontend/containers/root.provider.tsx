'use client';

import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { StoreProvider } from './store.provider';
import { TransitionProvider } from './transition.provider';

import { useAuthGetAuthenticationStatusQuery } from '$api/generated/financerApi';
import { ToastMessageTypes } from '$blocks/toast/toast';
import { PageInfoProvider } from '$context/pageInfoContext';
import { Loader } from '$elements/loader/loader';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { Login } from '$views/login/login';
import {
  removeToastMessage,
  addToastMessage,
} from '$reducer/notifications.reducer';
import { ScrollToTop } from '$renderers/scroll-to-top/scroll-to-top';
import { ChildrenProp } from 'src/types/children-prop';

const PUBLIC_ROUTES = ['/privacy-policy', '/issues-with-login'];

const App: FC<ChildrenProp> = ({ children }) => {
  const { data: authenticationStatus, isLoading } =
    useAuthGetAuthenticationStatusQuery();
  const { push } = useViewTransitionRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [hasBeenRedirected, setHasBeenRedirected] = useState(false);

  useEffect(() => {
    if (hasBeenRedirected) return;

    if (
      !authenticationStatus?.authenticated ||
      authenticationStatus?.hasAccounts
    ) {
      dispatch(removeToastMessage('welcomeToFinancer'));
      return;
    }

    setHasBeenRedirected(true);

    push('/accounts/add');
    dispatch(
      addToastMessage({
        id: 'welcomeToFinancer',
        type: ToastMessageTypes.GENERAL,
        message: 'Welcome to Financer!',
        additionalInformation:
          'You must add your first account before you start tracking finances with Financer',
      }),
    );
  }, [push, authenticationStatus, dispatch, hasBeenRedirected]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const errors = authenticationStatus?.errors;

    if (!errors) return;

    dispatch(
      addToastMessage({
        id: 'authenticationStatusErrors',
        type: ToastMessageTypes.ERROR,
        message: 'Something went wrong!',
        additionalInformation: errors,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [authenticationStatus?.errors, dispatch]);

  if (isLoading) return <Loader />;

  const isAuthenticated = authenticationStatus?.authenticated;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  return <>{!isPublicRoute && !isAuthenticated ? <Login /> : children}</>;
};

export const RootProviderContainer: FC<ChildrenProp> = ({ children }) => {
  return (
    <StoreProvider>
      <TransitionProvider>
        <LoaderSuspense>
          <PageInfoProvider>
            {/* TODO check this stuff */}
            {/* <SEO /> */}
            <ScrollToTop />
            <App>{children}</App>
          </PageInfoProvider>
        </LoaderSuspense>
      </TransitionProvider>
    </StoreProvider>
  );
};
