import { Metadata } from 'next';
import { FC } from 'react';

import { SettingsPrivacyContainer } from '$container/settings/SettingsPrivacyContainer';

export const metadata: Metadata = {
  title: 'Privacy',
};

const SettingsPrivacyPage: FC = () => {
  return <SettingsPrivacyContainer />;
};

export default SettingsPrivacyPage;
