import { IAuthenticationStatus } from '@local/types';

import { parseJsonOrThrowError } from '../utils/apiHelper';

export const getAuthenticationStatus =
  async (): Promise<IAuthenticationStatus> => {
    const authenticationStatus = await fetch('/auth/status');
    return parseJsonOrThrowError(authenticationStatus);
  };
