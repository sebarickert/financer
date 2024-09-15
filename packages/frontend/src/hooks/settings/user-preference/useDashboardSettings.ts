import { useMemo } from 'react';

import {
  AccountType,
  UserPreferenceProperty,
  useUserPreferencesFindOneQuery,
} from '$api/generated/financerApi';

const userPreferenceProperty = UserPreferenceProperty.DashboardSettings;

type UserDashboardSettings = {
  accountTypes: AccountType[];
};

export const useUserDashboardSettings = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  const parsedData = useMemo(
    () =>
      data.data?.value
        ? (JSON.parse(data.data.value) as UserDashboardSettings)
        : undefined,
    [data?.data?.value],
  );

  return {
    ...data,
    data: parsedData,
  };
};
