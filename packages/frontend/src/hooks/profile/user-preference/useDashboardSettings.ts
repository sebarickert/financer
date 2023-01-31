import { useCallback } from 'react';

import {
  AccountTypeEnum,
  UserPreferencePropertyEnum,
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

const userPreferenceProperty = UserPreferencePropertyEnum.DashboardSettings;

type UserDashboardSettings = {
  accountTypes: AccountTypeEnum[];
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
