import { Route, Routes } from 'react-router-dom';

import { UserDefaultExpenseAccount } from './preferences/UserDefaultExpenseAccount';
import { UserDefaultIncomeAccount } from './preferences/UserDefaultIncomeAccount';
import { UserDefaultMarketUpdateSettings } from './preferences/UserDefaultMarketUpdateSettings';
import { UserDefaultTransferSourceAccount } from './preferences/UserDefaultTransferSourceAccount';
import { UserDefaultTransferTargetAccount } from './preferences/UserDefaultTransferTargetAccount';
import { UserTransactionListChunkSize } from './preferences/UserTransactionListChunkSize';
import { UserPreferences } from './UserPreferences';

export const UserPreferencesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<UserPreferences />} />
      <Route
        path="default-income-account"
        element={<UserDefaultIncomeAccount />}
      />
      <Route
        path="default-expense-account"
        element={<UserDefaultExpenseAccount />}
      />
      <Route
        path="default-transfer-source-account"
        element={<UserDefaultTransferSourceAccount />}
      />
      <Route
        path="default-transfer-target-account"
        element={<UserDefaultTransferTargetAccount />}
      />
      <Route
        path="transaction-list-chunk-size"
        element={<UserTransactionListChunkSize />}
      />
      <Route
        path="market-update-settings"
        element={<UserDefaultMarketUpdateSettings />}
      />
    </Routes>
  );
};
