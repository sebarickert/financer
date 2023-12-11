import { settingsPaths } from '$constants/settings-paths';
import {
  useUserStatisticsSettings,
  useUpdateUserStatisticsSettings,
} from '$hooks/settings/user-preference/useStatisticsSettings';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserStatisticsSettings,
  UserStatisticsSettingsFormFields,
} from '$pages/settings/user-preferences/preferences/user-statistics-settings';

export const StatisticsSettingsContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data, isLoading: isLoadingDefault } = useUserStatisticsSettings();
  const [setStatisticsSettings, { isLoading: isUpdating }] =
    useUpdateUserStatisticsSettings();

  const handleSave = async (
    newUserStatisticsData: UserStatisticsSettingsFormFields
  ) => {
    await setStatisticsSettings({
      accountTypes: newUserStatisticsData.accountTypes,
    });

    push(settingsPaths.userPreferences);
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
