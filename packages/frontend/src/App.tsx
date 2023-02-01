import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Notification } from './components/elements/notification/notification';
import { Financer } from './Financer';

import { useAuthGetAuthenticationStatusQuery } from '$api/generated/financerApi';
import { Loader } from '$elements/loader/loader';

export const App = (): JSX.Element => {
  const { data: authenticationStatus, isLoading } =
    useAuthGetAuthenticationStatusQuery();
  const navigate = useNavigate();
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
    navigate('/accounts/add');
  }, [navigate, isOnboardingVisible, authenticationStatus]);

  if (isLoading) return <Loader />;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const errors = authenticationStatus?.errors;
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
      <Financer isLoggedIn={!!authenticationStatus?.authenticated} />
    </>
  );
};
