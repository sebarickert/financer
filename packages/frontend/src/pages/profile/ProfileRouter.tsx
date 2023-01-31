import { Routes, Route } from 'react-router-dom';

import { Profile } from './Profile';
import { ProfileOverrideData } from './ProfileOverrideData';
import { TransactionCategoriesRouter } from './TransactionCategories/TransactionCategoriesRouter';
import { TransactionTemplatesRouter } from './TransactionTemplates/TransactionTemplatesRouter';
import { UserPreferencesRouter } from './UserPreferences/UserPreferencesRouter';

import { RoleEnum, useUsersFindOwnUserQuery } from '$api/generated/financerApi';

export const ProfileRouter = (): JSX.Element => {
  const { data: profileInfo } = useUsersFindOwnUserQuery();

  return (
    <Routes>
      <Route index element={<Profile />} />
      <Route
        path="transaction-categories/*"
        element={<TransactionCategoriesRouter />}
      />
      <Route
        path="transaction-templates/*"
        element={<TransactionTemplatesRouter />}
      />
      <Route path="user-preferences/*" element={<UserPreferencesRouter />} />
      {profileInfo?.roles.includes(RoleEnum.TestUser) && (
        <Route path="override-data" element={<ProfileOverrideData />} />
      )}
    </Routes>
  );
};
