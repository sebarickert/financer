import { Metadata } from 'next';

import { MaximumItemsPerPageSettingsContainer } from '$container/user-preferences/MaximumItemsPerPageSettingsContainer';

export const metadata: Metadata = {
  title: 'Maximum Items Per Page / User Preferences',
};

const MaximumItemsPerPageUserPreferencePage = () => {
  return <MaximumItemsPerPageSettingsContainer />;
};

export default MaximumItemsPerPageUserPreferencePage;
