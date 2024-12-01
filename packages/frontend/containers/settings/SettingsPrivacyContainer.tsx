import { FC } from 'react';

import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { settingsPaths } from '$constants/settings-paths';
import { SettingsLayout } from '$features/settings/SettingsLayout';

export const SettingsPrivacyContainer: FC = async () => {
  return (
    <SettingsLayout title="Privacy">
      <List>
        <ProminentLink link={settingsPaths.dataDownload} icon={'BoltIcon'}>
          Download My Data
        </ProminentLink>
      </List>
    </SettingsLayout>
  );
};