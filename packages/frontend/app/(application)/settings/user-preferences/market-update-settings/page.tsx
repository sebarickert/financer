import { Metadata } from 'next';

import { MarketUpdateSettingsContainer } from '$container/user-preferences/market-update-settings.container';
import { Layout } from '$layouts/Layout';

export const metadata: Metadata = {
  title: 'Market Update Settings',
};

const MarketUpdateSettingsUserPreferencePage = () => {
  return (
    <Layout title="Market Update Settings">
      <MarketUpdateSettingsContainer />
    </Layout>
  );
};

export default MarketUpdateSettingsUserPreferencePage;
