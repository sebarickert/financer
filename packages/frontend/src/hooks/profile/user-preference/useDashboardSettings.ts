import { AccountType, UserPreferenceProperty } from '@local/types';
import { useCallback } from 'react';

import {
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

const userPreferenceProperty = UserPreferenceProperty.DASHBOARD_SETTINGS;

type UserDashboardSettings = {
  accountTypes: AccountType[];
};

export const useUserDashboardSettings = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  return {
    ...data,
    data: data.data?.value
      ? (JSON.parse(data.data.value) as UserDashboardSettings)
      : undefined,
  };
};

export const useUpdateUserDashboardSettings = (): [
  (newValue: UserDashboardSettings) => void,
  ReturnType<typeof useUserPreferencesUpdateMutation>[1]
] => {
  const [updateMutation, data] = useUserPreferencesUpdateMutation();

  const updateUserPreference = useCallback(
    (newValue: UserDashboardSettings) => {
      updateMutation({
        updateUserPreferenceDto: {
          key: userPreferenceProperty,
          value: JSON.stringify(newValue),
        },
      });
    },
    [updateMutation]
  );

  return [updateUserPreference, data];
};
