import { useCallback } from 'react';

import {
  UserPreferenceProperty,
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

const userPreferenceProperty = UserPreferenceProperty.DefaultExpenseAccount;

export const useUserDefaultExpenseAccount = ({ skip = false } = {}) => {
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

export const useUpdateUserDefaultExpenseAccount = (): [
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
    },
    [updateMutation],
  );

  return [updateUserPreference, data];
};
