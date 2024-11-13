import { Metadata } from 'next';

import { StatisticsPageSettingsContainer } from '$container/user-preferences/StatisticsPageSettingsContainer';

export const metadata: Metadata = {
  title: 'Statistics Settings / User Preferences',
};

const StatisticsSettingsUserPreferencePage = () => {
  return <StatisticsPageSettingsContainer />;
};

export default StatisticsSettingsUserPreferencePage;
