import { useMemo } from 'react';

import {
  AccountType,
  UserPreferenceProperty,
  useUserPreferencesFindOneQuery,
} from '$api/generated/financerApi';

type UserStatisticsSettings = {
  accountTypes: AccountType[];
};

const userPreferenceProperty = UserPreferenceProperty.StatisticsSettings;

export const useUserStatisticsSettings = () => {
  const data = useUserPreferencesFindOneQuery({
    userPreferenceProperty,
  });

  const parsedData = useMemo(
    () =>
      data.data?.value
        ? (JSON.parse(data.data.value) as UserStatisticsSettings)
        : undefined,
    [data?.data?.value],
  );

  return {
    ...data,
    data: parsedData,
  };
};
