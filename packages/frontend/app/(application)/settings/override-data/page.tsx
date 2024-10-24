import { Metadata } from 'next';
import { FC } from 'react';

import { OverrideUserDataContainer } from '$container/settings/override-user-data.container';
import { Layout } from '$layouts/Layout';

export const metadata: Metadata = {
  title: 'Overwrite User Data (DANGER ZONE)',
};

const OverrideUserDataPage: FC = () => {
  return (
    <Layout title="Overwrite User Data (DANGER ZONE)">
      <OverrideUserDataContainer />
    </Layout>
  );
};

export default OverrideUserDataPage;
