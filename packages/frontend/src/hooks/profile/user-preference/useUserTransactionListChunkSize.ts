import { UserPreferenceProperty } from '@local/types';
import { useCallback } from 'react';

import {
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

const userPreferenceProperty =
  UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE;

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
  (newValue: number) => void,
  ReturnType<typeof useUserPreferencesUpdateMutation>[1]
] => {
  const [updateMutation, data] = useUserPreferencesUpdateMutation();

  const updateUserPreference = useCallback(
    (newValue: number) => {
      updateMutation({
        updateUserPreferenceDto: {
          key: userPreferenceProperty,
          value: newValue.toString(),
        },
      });
    },
    [updateMutation]
  );

  return [updateUserPreference, data];
};
