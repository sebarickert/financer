import { useUsersFindOwnUserQuery } from '$api/generated/financerApi';
import { Settings } from '$pages/settings/settings';

export const SettingsContainer = () => {
  const { data: userInfo } = useUsersFindOwnUserQuery();

  return <Settings roles={userInfo?.roles} />;
};
