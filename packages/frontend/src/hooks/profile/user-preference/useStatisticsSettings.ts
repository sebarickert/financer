import { useCallback } from 'react';

import {
  AccountTypeEnum,
  UserPreferencePropertyEnum,
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

type UserStatisticsSettings = {
  accountTypes: AccountTypeEnum[];
};

const userPreferenceProperty = UserPreferencePropertyEnum.StatisticsSettings;

export const useUserStatisticsSettings = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  return {
    ...data,
    data: data.data?.value
      ? (JSON.parse(data.data.value) as UserStatisticsSettings)
      : undefined,
  };
};

export const useUpdateUserStatisticsSettings = (): [
  (newValue: UserStatisticsSettings) => void,
  ReturnType<typeof useUserPreferencesUpdateMutation>[1]
] => {
  const [updateMutation, data] = useUserPreferencesUpdateMutation();

  const updateUserPreference = useCallback(
    (newValue: UserStatisticsSettings) => {
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
