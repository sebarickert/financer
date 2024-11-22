import { Metadata } from 'next';
import { FC } from 'react';

import { SettingsPreferencesContainer } from '$container/settings/SettingsPreferencesContainer';

export const metadata: Metadata = {
  title: 'Preferences',
};

const SettingsPreferencesPage: FC = () => {
  return <SettingsPreferencesContainer />;
};

export default SettingsPreferencesPage;
