import { useQuery } from 'react-query';

import { getAuthenticationStatus } from '../services/AuthenticationService';

export const useAuthenticationStatus = () => {
  const authenticationStatusQuery = useQuery(
    ['authenticationStatus'],
    getAuthenticationStatus,
    {
      staleTime: 300000,
    }
  );

  return authenticationStatusQuery.data || null;
};
