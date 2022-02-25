import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import {
  IOverrideProfileData,
  postOverrideProfileData,
} from '../../services/ProfileService';

export const useOverrideProfileData = () => {
  const queryClient = useQueryClient();

  return useCallback(
    async (overrideProfileData: IOverrideProfileData) => {
      const response = await postOverrideProfileData(overrideProfileData);
      queryClient.invalidateQueries();

      return response;
    },
    [queryClient]
  );
};
