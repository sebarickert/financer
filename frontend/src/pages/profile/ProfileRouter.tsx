import { Routes, Route } from 'react-router-dom';

import { useProfileInformation } from '../../hooks/profile/useProfileInformation';

import { Profile } from './Profile';
import { ProfileOverrideData } from './ProfileOverrideData';
import { TransactionCategoriesRouter } from './TransactionCategories/TransactionCategoriesRouter';
import { UserPreferencesRouter } from './UserPreferences/UserPreferencesRouter';

export const ProfileRouter = (): JSX.Element => {
  const profileInfo = useProfileInformation();

  return (
    <Routes>
      <Route index element={<Profile />} />
      <Route
        path="transaction-categories/*"
        element={<TransactionCategoriesRouter />}
      />
      <Route path="user-preferences/*" element={<UserPreferencesRouter />} />
      {profileInfo?.roles.includes('test-user') && (
        <Route path="override-data" element={<ProfileOverrideData />} />
      )}
    </Routes>
  );
};
