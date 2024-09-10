import { useCallback } from 'react';

import {
  UserPreferenceProperty,
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';
import { clearUserPreferenceCache } from '$ssr/api/clear-cache';

const userPreferenceProperty = UserPreferenceProperty.TransactionListChunkSize;

export const useUserTransactionListChunkSize = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  return {
    ...data,
    data: data.data?.value ? parseInt(data.data?.value) : 5,
  };
};

export const useUpdateUserTransactionListChunkSize = (): [
  (newValue: number) => Promise<void>,
  ReturnType<typeof useUserPreferencesUpdateMutation>[1],
] => {
  const [updateMutation, data] = useUserPreferencesUpdateMutation();

  const updateUserPreference = useCallback(
    async (newValue: number) => {
      await updateMutation({
        updateUserPreferenceDto: {
          key: userPreferenceProperty,
          value: newValue.toString(),
        },
      }).unwrap();
      await clearUserPreferenceCache();
    },
    [updateMutation],
  );

  return [updateUserPreference, data];
};
