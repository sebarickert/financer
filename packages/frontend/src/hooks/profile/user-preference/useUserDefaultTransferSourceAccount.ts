import { UserPreferenceProperty } from '@local/types';
import { useCallback } from 'react';

import {
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

const userPreferenceProperty =
  UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT;

export const useUserDefaultTransferSourceAccount = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  return {
    ...data,
    data: data.data?.value,
  };
};

export const useUpdateUserDefaultTransferSourceAccount = (): [
  (newValue: string) => void,
  ReturnType<typeof useUserPreferencesUpdateMutation>[1]
] => {
  const [updateMutation, data] = useUserPreferencesUpdateMutation();

  const updateUserPreference = useCallback(
    (userPreferenceValue: string) => {
      updateMutation({
        updateUserPreferenceDto: {
          key: userPreferenceProperty,
          value: userPreferenceValue,
        },
      });
    },
    [updateMutation]
  );

  return [updateUserPreference, data];
};
