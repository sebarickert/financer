import { Metadata } from 'next';

import { DashboardSettingsContainer } from '$container/user-preferences/DashboardSettingsContainer';

export const metadata: Metadata = {
  title: 'Dashboard Settings',
};

const DashboardSettingsUserPreferencePage = () => {
  return <DashboardSettingsContainer />;
};

export default DashboardSettingsUserPreferencePage;
