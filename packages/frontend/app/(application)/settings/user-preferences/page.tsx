import { Metadata } from 'next';
import { FC } from 'react';

import { UserPreferencesContainer } from '$container/settings/UserPreferencesContainer';

export const metadata: Metadata = {
  title: 'User Preferences',
};

const UserPreferenceListingPage: FC = () => {
  return <UserPreferencesContainer />;
};

export default UserPreferenceListingPage;
