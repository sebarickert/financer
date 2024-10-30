import { Metadata } from 'next';

import { MarketUpdateSettingsContainer } from '$container/user-preferences/MarketUpdateSettingsContainer';

export const metadata: Metadata = {
  title: 'Market Update Settings',
};

const MarketUpdateSettingsUserPreferencePage = () => {
  return <MarketUpdateSettingsContainer />;
};

export default MarketUpdateSettingsUserPreferencePage;
