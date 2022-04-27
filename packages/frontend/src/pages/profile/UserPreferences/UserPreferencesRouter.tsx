import { Route, Routes } from 'react-router-dom';

import { UserDashboardSettings } from './preferences/UserDashboardSettings';
import { UserDefaultAccountSettings } from './preferences/UserDefaultAccountSettings';
import { UserDefaultMarketUpdateSettings } from './preferences/UserDefaultMarketUpdateSettings';
import { UserStatisticsSettings } from './preferences/UserStatisticsSettings';
import { UserTransactionListChunkSize } from './preferences/UserTransactionListChunkSize';
import { UserPreferences } from './UserPreferences';

export const UserPreferencesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<UserPreferences />} />
      <Route path="dashboard-settings" element={<UserDashboardSettings />} />
      <Route path="statistics-settings" element={<UserStatisticsSettings />} />
      <Route
        path="default-account-settings"
        element={<UserDefaultAccountSettings />}
      />
      <Route
        path="maximum-items-per-page"
        element={<UserTransactionListChunkSize />}
      />
      <Route
        path="market-update-settings"
        element={<UserDefaultMarketUpdateSettings />}
      />
    </Routes>
  );
};
