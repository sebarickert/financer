import { Route, Routes } from 'react-router-dom';

import { UserPreferences } from './UserPreferences';

export const UserPreferencesRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<UserPreferences />} />
    </Routes>
  );
};
