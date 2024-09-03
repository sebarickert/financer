import { Metadata } from 'next';

import { OverrideUserDataContainer } from '$container/settings/override-user-data.container';
import { Layout } from '$layouts/layout/layout';

export const metadata: Metadata = {
  title: 'Override User Data (DANGER ZONE)',
};

const OverrideUserDataPage = () => {
  return (
    <Layout title="Override User Data (DANGER ZONE)">
      <OverrideUserDataContainer />
    </Layout>
  );
};

export default OverrideUserDataPage;
