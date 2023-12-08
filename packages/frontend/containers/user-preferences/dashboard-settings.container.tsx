import { settingsPaths } from '$constants/settings-paths';
import {
  useUserDashboardSettings,
  useUpdateUserDashboardSettings,
} from '$hooks/settings/user-preference/useDashboardSettings';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserDashboardSettings,
  UserDashboardSettingsFormFields,
} from '$pages/settings/user-preferences/preferences/user-dashboard-settings';

export const DashboardSettingsContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data, isLoading: isLoadingDefault } = useUserDashboardSettings();
  const [setDashboardSettings, { isLoading: isUpdating }] =
    useUpdateUserDashboardSettings();

  const handleSave = async (
    newUserDashboardData: UserDashboardSettingsFormFields
  ) => {
    await setDashboardSettings({
      accountTypes: newUserDashboardData.accountTypes,
    });

    push(settingsPaths.userPreferences);
  };

  return (
    <UserDashboardSettings
      data={data}
      isLoading={isLoadingDefault}
      isUpdating={isUpdating}
      onSave={handleSave}
    />
  );
};
