import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from './components/loader/loader';
import { Notification } from './components/notification/notification';
import { Financer } from './Financer';
import { useAllAccounts } from './hooks/account/useAllAccounts';
import { useAuthenticationStatus } from './hooks/useAuthenticationStatus';

export const App = (): JSX.Element => {
  const authenticationStatus = useAuthenticationStatus();
  const { data: accounts } = useAllAccounts();
  const navigate = useNavigate();
  const [isOnboardingVisible, setOnboardingVisible] = useState(false);

  useEffect(() => {
    if (!accounts || accounts.length || isOnboardingVisible) return;

    setOnboardingVisible(true);
    navigate('/accounts/add');
  }, [accounts, navigate, isOnboardingVisible]);

  return !authenticationStatus ? (
    <Loader />
  ) : (
    <>
      {authenticationStatus.errors && (
        <Notification type="error" label="Something went wrong!">
          {authenticationStatus.errors?.join(' ') || ''}
        </Notification>
      )}
      {isOnboardingVisible && (
        <Notification type={'success'} label={'Welcome to Financer!'}>
          Please add your first account before you start tracking finances with
          Financer.
        </Notification>
      )}
      <Financer isLoggedIn={authenticationStatus?.authenticated} />
    </>
  );
};
