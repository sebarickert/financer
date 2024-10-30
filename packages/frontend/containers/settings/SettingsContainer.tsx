import { FC } from 'react';

import { Layout } from '$layouts/Layout';
import { UserService } from '$ssr/api/user.service';
import { Settings } from '$views/Settings';

export const SettingsContainer: FC = async () => {
  const userInfo = await UserService.getOwnUser();

  return (
    <Layout title="Settings">
      <Settings roles={userInfo.roles} />
    </Layout>
  );
};
