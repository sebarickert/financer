import { Metadata } from 'next';
import { FC } from 'react';

import { OverrideUserDataContainer } from '$container/settings/override-user-data.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Override User Data (DANGER ZONE)',
};

const OverrideUserDataPage: FC = () => {
  return (
    <Layout title="Override User Data (DANGER ZONE)">
      <OverrideUserDataContainer />
    </Layout>
  );
};

export default OverrideUserDataPage;
