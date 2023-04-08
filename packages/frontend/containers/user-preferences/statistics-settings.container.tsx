import { useRouter } from 'next/router';

import {
  useUserStatisticsSettings,
  useUpdateUserStatisticsSettings,
} from '$hooks/profile/user-preference/useStatisticsSettings';
import {
  UserStatisticsSettings,
  UserStatisticsSettingsFormFields,
} from '$pages/profile/user-preferences/preferences/user-statistics-settings';

export const StatisticsSettingsContainer = () => {
  const { push } = useRouter();
  const { data, isLoading: isLoadingDefault } = useUserStatisticsSettings();
  const [setStatisticsSettings, { isLoading: isUpdating }] =
    useUpdateUserStatisticsSettings();

  const handleSave = async (
    newUserStatisticsData: UserStatisticsSettingsFormFields
  ) => {
    await setStatisticsSettings({
      accountTypes: newUserStatisticsData.accountTypes,
    });

    push('/profile/user-preferences');
  };

  return (
    <UserStatisticsSettings
      data={data}
      isLoading={isLoadingDefault}
      isUpdating={isUpdating}
      onSave={handleSave}
    />
  );
};
