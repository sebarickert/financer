import { useQuery } from 'react-query';

import { getAuthenticationStatus } from '../services/AuthenticationService';

export const useAuthenticationStatus = () => {
  const authenticationStatusQuery = useQuery(
    ['authenticationStatus'],
    getAuthenticationStatus
  );

  return authenticationStatusQuery.data || null;
};
