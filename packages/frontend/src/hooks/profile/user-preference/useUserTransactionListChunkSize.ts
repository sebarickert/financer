import { useCallback } from 'react';

import {
  UserPreferencePropertyEnum,
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

const userPreferenceProperty =
  UserPreferencePropertyEnum.TransactionListChunkSize;

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
