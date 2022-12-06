import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Notification } from './components/elements/notification/notification';
import { Financer } from './Financer';
import { useAuthenticationStatus } from './hooks/useAuthenticationStatus';
import { store } from './redux/store';

export const App = (): JSX.Element => {
  const authenticationStatus = useAuthenticationStatus();
  const navigate = useNavigate();
  const [isOnboardingVisible, setOnboardingVisible] = useState(false);

  useEffect(() => {
    if (
      !authenticationStatus?.authenticated ||
      authenticationStatus.hasAccounts ||
      isOnboardingVisible
    ) {
      return;
    }

    setOnboardingVisible(true);
    navigate('/accounts/add');
  }, [navigate, isOnboardingVisible, authenticationStatus]);

  return (
    <Provider store={store}>
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
    </Provider>
  );
};
