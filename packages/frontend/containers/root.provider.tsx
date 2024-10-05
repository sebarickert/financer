'use client';

import { ViewTransitions } from 'next-view-transitions';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { StoreProvider } from './store.provider';

import { ToastMessageTypes } from '$blocks/toast/toast';
import { PageInfoProvider } from '$context/pageInfoContext';
import {
  addToastMessage,
  removeToastMessage,
} from '$reducer/notifications.reducer';
import { ScrollToTop } from '$renderers/scroll-to-top/scroll-to-top';

type RootProviderContainerProps = {
  children: React.ReactNode;
  shouldShowOnboarding: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authenticationErrors: any;
};

const App: FC<RootProviderContainerProps> = ({
  children,
  shouldShowOnboarding,
  authenticationErrors,
}) => {
  const dispatch = useDispatch();

  const [hasShownOnboarding, setHasShownOnboarding] = useState(false);

  useEffect(() => {
    if (hasShownOnboarding && !shouldShowOnboarding) {
      dispatch(removeToastMessage('welcomeToFinancer'));
      return;
    }

    if (hasShownOnboarding || !shouldShowOnboarding) return;

    setHasShownOnboarding(true);

    dispatch(
      addToastMessage({
        id: 'welcomeToFinancer',
        type: ToastMessageTypes.GENERAL,
        message: 'Welcome to Financer!',
        additionalInformation:
          'You must add your first account before you start tracking finances with Financer',
      }),
    );
  }, [dispatch, hasShownOnboarding, shouldShowOnboarding]);

  useEffect(() => {
    if (!authenticationErrors) return;

    dispatch(
      addToastMessage({
        id: 'authenticationStatusErrors',
        type: ToastMessageTypes.ERROR,
        message: 'Something went wrong!',
        additionalInformation: authenticationErrors,
      }),
    );
  }, [authenticationErrors, dispatch]);

  return children;
};

export const RootProviderContainer: FC<RootProviderContainerProps> = (
  props,
) => {
  return (
    <StoreProvider>
      <ViewTransitions>
        <PageInfoProvider>
          <ScrollToTop />
          <App {...props} />
        </PageInfoProvider>
      </ViewTransitions>
    </StoreProvider>
  );
};
