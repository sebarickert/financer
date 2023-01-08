import { UserPreferenceProperty } from '@local/types';
import { useCallback } from 'react';

import {
  useUserPreferencesFindOneQuery,
  useUserPreferencesUpdateMutation,
} from '$api/generated/financerApi';

export type UserDefaultMarketUpdateSettings = {
  transactionDescription: string;
  category?: string;
};

const userPreferenceProperty =
  UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE;

export const useUserDefaultMarketUpdateSettings = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  return {
    ...data,
    data: data.data?.value ? JSON.parse(data.data.value) : undefined,
  };
};

export const useUpdateUserDefaultMarketUpdateSettings = (): [
  (newValue: UserDefaultMarketUpdateSettings) => void,
  ReturnType<typeof useUserPreferencesUpdateMutation>[1]
] => {
  const [updateMutation, data] = useUserPreferencesUpdateMutation();

  const updateUserPreference = useCallback(
    (newValue: UserDefaultMarketUpdateSettings) => {
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
