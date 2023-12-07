import {
  useUserDashboardSettings,
  useUpdateUserDashboardSettings,
} from '$hooks/profile/user-preference/useDashboardSettings';
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

    push('/profile/user-preferences');
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
