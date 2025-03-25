import { Download } from 'lucide-react';
import { Metadata } from 'next';

import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { settingsContextualNavigationItems } from '@/constants/settingsContextualNavigationItems';
import { settingsPaths } from '@/constants/settingsPaths';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Privacy',
};

export default function SettingsPrivacyPage() {
  return (
    <>
      <ContentHeader
        title="Privacy"
        contextualNavigationItems={settingsContextualNavigationItems}
      />
      <List>
        <ProminentLink link={settingsPaths.dataDownload} Icon={Download}>
          Download My Data
        </ProminentLink>
      </List>
    </>
  );
}
