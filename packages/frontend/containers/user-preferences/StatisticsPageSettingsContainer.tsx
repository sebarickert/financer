import { FC } from 'react';

import { handleStatisticsPageSettingsUpdate } from '@/actions/settings/handleStatisticsPageSettingsUpdate';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { settingsPaths } from '@/constants/settingsPaths';
import { Layout } from '@/layouts/Layout';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
import { UserStatisticsPageSettingsForm } from '@/views/user-preferences/UserStatisticsPageSettingsForm';

export const StatisticsPageSettingsContainer: FC = async () => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  return (
    <Layout
      title="Transactions & Statistics Settings"
      backLink={settingsPaths.userPreferences}
    >
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
    </Layout>
  );
};
