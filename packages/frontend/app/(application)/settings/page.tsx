import { Metadata } from 'next';
import { FC } from 'react';

import { SettingsContainer } from '$container/settings/SettingsContainer';

export const metadata: Metadata = {
  title: 'Settings',
};

const SettingsPage: FC = () => {
  return <SettingsContainer />;
};

export default SettingsPage;
