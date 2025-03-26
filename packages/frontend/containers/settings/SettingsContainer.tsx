import { TriangleAlert } from 'lucide-react';
import { FC } from 'react';

import { Role } from '@/api/ssr-financer-api';
import { getOwnUser } from '@/api-service';
import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { ThemeSwitcher } from '@/blocks/ThemeSwitcher/ThemeSwitcher';
import { settingsPaths } from '@/constants/settingsPaths';
import { Button } from '@/elements/Button/Button';
import { Heading } from '@/elements/Heading';
import { SettingsLayout } from '@/features/settings/SettingsLayout';

export const SettingsContainer: FC = async () => {
  const userInfo = await getOwnUser();

  return (
    <SettingsLayout title="General">
      <div className="grid gap-6">
        <List>
          {userInfo.roles.includes(Role.TEST_USER) && (
            <ProminentLink
              link={settingsPaths.dataOverwrite}
              Icon={TriangleAlert}
            >
              Overwrite User Data
            </ProminentLink>
          )}
        </List>
        <div>
          <Heading>Appearance</Heading>
          <ThemeSwitcher />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-12 sm:flex-row">
        <Button accentColor="secondary" href="/auth/logout">
          Sign out
        </Button>
      </div>
    </SettingsLayout>
  );
};
