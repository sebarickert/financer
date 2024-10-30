import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { handleOverwriteUserData } from 'src/actions/handleOverwriteUserData';
import { OverwriteUserData } from 'src/components/views/OverwriteUserData';

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
