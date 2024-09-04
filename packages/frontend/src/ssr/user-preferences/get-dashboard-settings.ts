import {
  AccountType,
  UserPreferenceProperty,
} from '$api/generated/financerApi';
import { getServerData } from '$ssr/get-server-data';

const userPreferenceProperty = UserPreferenceProperty.DashboardSettings;

type UserDashboardSettings = {
  accountTypes: AccountType[];
};

export const getDashboardSettings = async (): Promise<
  UserDashboardSettings | undefined
> => {
  const { data } = await getServerData('userPreferencesFindOne', {
    userPreferenceProperty,
  });

  return data?.value
    ? (JSON.parse(data.value) as UserDashboardSettings)
    : undefined;
};
