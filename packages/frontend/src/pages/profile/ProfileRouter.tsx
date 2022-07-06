import { Role } from '@local/types';
import { Routes, Route } from 'react-router-dom';

import { useProfileInformation } from '../../hooks/profile/useProfileInformation';

import { Profile } from './Profile';
import { ProfileOverrideData } from './ProfileOverrideData';
import { ShortcutsRouter } from './Shortcuts/ShortcutsRouter';
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
      <Route path="shortcuts/*" element={<ShortcutsRouter />} />
      <Route path="user-preferences/*" element={<UserPreferencesRouter />} />
      {profileInfo?.roles.includes(Role.testUser) && (
        <Route path="override-data" element={<ProfileOverrideData />} />
      )}
    </Routes>
  );
};
