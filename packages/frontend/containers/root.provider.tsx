'use client';

import { ViewTransitions } from 'next-view-transitions';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { StoreProvider } from './store.provider';

import { ScrollToTop } from '$blocks/ScrollToTop';
import { ToastMessageTypes } from '$blocks/Toast/Toast';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/Link';
import {
  addToastMessage,
  removeToastMessage,
} from '$reducer/notifications.reducer';

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
        message: "We're excited to have you on board with Financer!",
        additionalInformation:
          'Add your first account to start tracking expenses, income, savings, and investments in one place.',
        action: (
          <Link href="/accounts/add" className="inline-flex items-center gap-2">
            Add Account <Icon name="ArrowRightIcon" />
          </Link>
        ),
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
        <ScrollToTop />
        <App {...props} />
      </ViewTransitions>
    </StoreProvider>
  );
};
