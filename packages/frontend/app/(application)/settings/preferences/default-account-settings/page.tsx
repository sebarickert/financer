import { Metadata } from 'next';

import { DefaultAccountSettingsContainer } from '@/container/user-preferences/DefaultAccountSettingsContainer';

export const metadata: Metadata = {
  title: 'Default Account Settings',
};

const DefaultAccountSettingsUserPreferencePage = () => {
  return <DefaultAccountSettingsContainer />;
};

export default DefaultAccountSettingsUserPreferencePage;
