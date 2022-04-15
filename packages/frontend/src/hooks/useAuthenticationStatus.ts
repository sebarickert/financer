import { IAuthenticationStatus } from '@local/types';
import { useQuery } from 'react-query';

import { getAuthenticationStatus } from '../services/AuthenticationService';

export const useAuthenticationStatus = (): IAuthenticationStatus => {
  const { data } = useQuery(['authenticationStatus'], getAuthenticationStatus);

  return data ?? ({} as IAuthenticationStatus);
};
