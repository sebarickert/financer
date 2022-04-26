import { AccountType, UserPreferenceProperty } from '@local/types';
import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import {
  getUserPreferenceByProperty,
  editUserPreference,
} from '../../../services/user-preference-service';

const targetUserPreference = UserPreferenceProperty.DASHBOARD_SETTINGS;

type UserDashboardSettings = {
  accountTypes: AccountType[];
};

export const useUserDashboardSettings = (): [
  dashboardSettings: UserDashboardSettings | undefined,
  setDashboardSettings: ({
    accountTypes,
  }: UserDashboardSettings) => Promise<void>
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

  const updateDashboardSettings = useCallback(
    async ({ accountTypes }: UserDashboardSettings) => {
      const newUserPreferenceData = {
        key: targetUserPreference,
        value: JSON.stringify({ accountTypes }),
      };
      await editUserPreference(newUserPreferenceData);
      queryClient.invalidateQueries(['user-preferences', targetUserPreference]);
    },
    [queryClient]
  );

  return [
    data?.value ? JSON.parse(data.value) : undefined,
    updateDashboardSettings,
  ];
};
