import { Route, Routes } from 'react-router-dom';

import { UserDefaultAccountSettings } from './preferences/UserDefaultAccountSettings';
import { UserDefaultMarketUpdateSettings } from './preferences/UserDefaultMarketUpdateSettings';
import { UserTransactionListChunkSize } from './preferences/UserTransactionListChunkSize';
import { UserPreferences } from './UserPreferences';

export const UserPreferencesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<UserPreferences />} />
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
