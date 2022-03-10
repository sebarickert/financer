import { useQuery } from 'react-query';

import { getProfileInformation } from '../../services/ProfileService';

export const useProfileInformation = (): IUser | null => {
  const profileQuery = useQuery('profile', getProfileInformation, {
    staleTime: 300000,
  });

  return profileQuery.data || null;
};
