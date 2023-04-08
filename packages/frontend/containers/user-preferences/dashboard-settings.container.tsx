import { useRouter } from 'next/router';

import {
  useUserDashboardSettings,
  useUpdateUserDashboardSettings,
} from '$hooks/profile/user-preference/useDashboardSettings';
import {
  UserDashboardSettings,
  UserDashboardSettingsFormFields,
} from '$pages/profile/user-preferences/preferences/user-dashboard-settings';

export const DashboardSettingsContainer = () => {
  const { push } = useRouter();
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
