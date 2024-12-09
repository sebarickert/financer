import { FC } from 'react';

import { handleOverwriteUserData } from '$actions/user/handleOverwriteUserData';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { OverwriteUserData } from '$views/OverwriteUserData';

export const OverwriteUserDataContainer: FC = () => {
  return (
    <Layout
      title="Overwrite User Data (DANGER ZONE)"
      backLink={settingsPaths.default}
    >
      <OverwriteUserData onOverwriteData={handleOverwriteUserData} />
    </Layout>
  );
};
