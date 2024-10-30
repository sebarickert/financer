import { FC } from 'react';

import { handleTransactionListSizeChunkSizeUpdate } from '$actions/settings/handleTransactionListSizeChunkSizeUpdate';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserTransactionListChunkSizeForm } from '$views/user-preferences/UserTransactionListChunkSizeForm';

export const MaximumItemsPerPageSettingsContainer: FC = async () => {
  const defaultChunkSize =
    await UserPreferenceService.getTransactionListChunkSize();

  return (
    <Layout
      title="Maximum Items Per Page"
      backLink={settingsPaths.userPreferences}
    >
      <UserTransactionListChunkSizeForm
        defaultChunkSize={defaultChunkSize}
        onSave={handleTransactionListSizeChunkSizeUpdate}
      />
    </Layout>
  );
};
