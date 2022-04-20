import { UserPreferenceProperty } from '@local/types';
import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import {
  getUserPreferenceByProperty,
  editUserPreference,
} from '../../../services/user-preference-service';

const targetUserPreference =
  UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE;

export const useUserDefaultMarketUpdateSettings = (): [
  defaultMarketSettings:
    | { transactionDescription: string; category?: string }
    | undefined,
  setDefaultTransferTargetAccount: ({
    transactionDescription,
    category,
  }: {
    transactionDescription: string;
    category?: string;
  }) => Promise<void>
] => {
  const queryClient = useQueryClient();
  const { data, error } = useQuery(
    ['user-preferences', targetUserPreference],
    () => getUserPreferenceByProperty(targetUserPreference)
  );

  if (error) {
    throw new Error(
      `Failed to fetch user preference for ${targetUserPreference}`
    );
  }

  const updateDefaultMarketSettings = useCallback(
    async ({
      transactionDescription,
      category,
    }: {
      transactionDescription: string;
      category?: string;
    }) => {
      const newUserPreferenceData = {
        key: targetUserPreference,
        value: JSON.stringify({ transactionDescription, category }),
      };
      await editUserPreference(newUserPreferenceData);
      queryClient.invalidateQueries(['user-preferences', targetUserPreference]);
    },
    [queryClient]
  );

  return [
    data?.value ? JSON.parse(data.value) : undefined,
    updateDefaultMarketSettings,
  ];
};
