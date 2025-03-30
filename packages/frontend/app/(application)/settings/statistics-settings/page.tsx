import { Metadata } from 'next';

import { handleStatisticsPageSettingsUpdate } from '@/actions/settings/handleStatisticsPageSettingsUpdate';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { ContentHeader } from '@/layouts/ContentHeader';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
import { UserStatisticsPageSettingsForm } from '@/views/user-preferences/UserStatisticsPageSettingsForm';

export const metadata: Metadata = {
  title: 'Transactions & Statistics Settings',
};

export default async function SettingsPreferencesPage() {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  return (
    <>
      <ContentHeader title="Transactions & Statistics Settings" />
      <InfoMessageBlock
        title="Account Types"
        className="mb-6"
        variant="barebone"
      >
        The selected account types will determine the calculated numbers and
        charts on your transactions and statistics pages.
      </InfoMessageBlock>
      <UserStatisticsPageSettingsForm
        data={statisticsSettings}
        onSave={handleStatisticsPageSettingsUpdate}
      />
    </>
  );
}
