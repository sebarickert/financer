import { Layers, Tag, TriangleAlert } from 'lucide-react';
import { FC } from 'react';

import { Role } from '$api/generated/financerApi';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { ThemeSwitcher } from '$blocks/ThemeSwitcher/ThemeSwitcher';
import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { UserService } from '$ssr/api/UserService';

export const SettingsContainer: FC = async () => {
  const userInfo = await UserService.getOwnUser();

  return (
    <SettingsLayout title="General">
      <div className="grid gap-8">
        <List>
          <ProminentLink link={settingsPaths.templates} Icon={Layers}>
            Templates
          </ProminentLink>
          <ProminentLink link={settingsPaths.categories} Icon={Tag}>
            Categories
          </ProminentLink>
        </List>
        <List>
          {userInfo.roles.includes(Role.TestUser) && (
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
