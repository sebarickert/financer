import { IAuthenticationStatus } from '@local/types';

export const getAuthenticationStatus =
  async (): Promise<IAuthenticationStatus> => {
    const authenticationStatus = await fetch('/auth/status');
    return authenticationStatus.json();
  };
