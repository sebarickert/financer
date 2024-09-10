import { useCallback } from 'react';

import {
  UserPreferenceProperty,
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';
import { clearUserPreferenceCache } from '$ssr/api/clear-cache';

const userPreferenceProperty =
  UserPreferenceProperty.DefaultTransferTargetAccount;

export const useUserDefaultTransferTargetAccount = ({ skip = false } = {}) => {
  const data = useUserPreferencesFindOneQuery(
    {
      userPreferenceProperty,
    },
    { skip },
  );

  return {
    ...data,
    data: data.data?.value,
  };
};

export const useUpdateUserDefaultTransferTargetAccount = (): [
  (newValue: string) => Promise<void>,
  ReturnType<typeof useUserPreferencesUpdateMutation>[1],
] => {
  const [updateMutation, data] = useUserPreferencesUpdateMutation();

  const updateUserPreference = useCallback(
    async (userPreferenceValue: string) => {
      await updateMutation({
        updateUserPreferenceDto: {
          key: userPreferenceProperty,
          value: userPreferenceValue,
        },
      }).unwrap();
      await clearUserPreferenceCache();
    },
    [updateMutation],
  );

  return [updateUserPreference, data];
};
