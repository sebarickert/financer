import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserTransactionListChunkSize } from '$views/settings/user-preferences/preferences/user-transaction-list-chunk-size';

export const MaximumItemsPerPageContainer: FC = async () => {
  const defaultChunkSize =
    await UserPreferenceService.getTransactionListChunkSize();

  const handleSave: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    await UserPreferenceService.updateTransactionListChunkSize(
      parseInt(formData.get('chunkSize') as string),
    );

    redirect(settingsPaths.userPreferences, RedirectType.push);
  };

  return (
    <UserTransactionListChunkSize
      defaultChunkSize={defaultChunkSize}
      onSave={handleSave}
    />
  );
};
