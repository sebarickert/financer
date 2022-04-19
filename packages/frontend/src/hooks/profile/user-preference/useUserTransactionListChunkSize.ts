import { UserPreferenceProperty } from '@local/types';
import { useCallback } from 'react';
import { useQueryClient, useQuery } from 'react-query';

import {
  getUserPreferenceByProperty,
  editUserPreference,
} from '../../../services/user-preference-service';

const targetUserPreference = UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE;

export const useUserTransactionListChunkSize = (): [
  chunkSize: number,
  setChunkSize: (value: number) => void
] => {
  const queryClient = useQueryClient();
  const { data, error } = useQuery(
    ['user-preferences', targetUserPreference],
    () => getUserPreferenceByProperty(targetUserPreference)
  );

  if (error) {
    throw new Error(
      `Failed to fetch user preference for ${targetUserPreference}`
    );
  }

  const updateDefaultMarketSettings = useCallback(
    async (value: number) => {
      const newUserPreferenceData = {
        key: targetUserPreference,
        value: value.toString(),
      };
      await editUserPreference(newUserPreferenceData);
      queryClient.invalidateQueries(['user-preferences', targetUserPreference]);
    },
    [queryClient]
  );

  return [data?.value ? parseInt(data.value) : 5, updateDefaultMarketSettings];
};
