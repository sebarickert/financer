import { useCallback } from 'react';

import {
  UserPreferencePropertyEnum,
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

const userPreferenceProperty =
  UserPreferencePropertyEnum.DefaultTransferTargetAccount;

export const useUserDefaultTransferTargetAccount = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  return {
    ...data,
    data: data.data?.value,
  };
};

export const useUpdateUserDefaultTransferTargetAccount = (): [
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
