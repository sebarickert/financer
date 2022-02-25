import { Loader } from './components/loader/loader';
import { Notification } from './components/notification/notification';
import { Financer } from './Financer';
import { useAuthenticationStatus } from './hooks/useAuthenticationStatus';

export const App = (): JSX.Element => {
  const authenticationStatus = useAuthenticationStatus();

  return !authenticationStatus ? (
    <Loader />
  ) : (
    <>
      {authenticationStatus.errors && (
        <Notification
          type="error"
          label="Something went wrong!"
          className="z-20"
        >
          {authenticationStatus.errors?.join(' ') || ''}
        </Notification>
      )}
      <Financer isLoggedIn={authenticationStatus?.authenticated} />
    </>
  );
};
