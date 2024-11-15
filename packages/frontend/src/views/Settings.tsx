import { FC, useMemo } from 'react';

import { Role } from '$api/generated/financerApi';
import { HardRefreshButton } from '$blocks/HardRefreshButton';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { ThemeSwitcher } from '$blocks/ThemeSwitcher/ThemeSwitcher';
import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';
import { IconName } from '$elements/Icon';

type SettingsProps = {
  roles?: Role[];
};

export const Settings: FC<SettingsProps> = ({ roles }) => {
  const urls = useMemo(
    () => [
      {
        label: 'Account',
        items: [
          {
            children: 'User Preferences',
            link: settingsPaths.userPreferences,
            icon: 'UserCircleIcon' as IconName,
          },
          {
            children: 'Download My Data',
            link: settingsPaths.dataDownload,
            icon: 'CloudArrowDownIcon' as IconName,
          },
        ],
      },
      {
        label: 'Financer',
        items: [
          {
            children: 'Templates',
            link: settingsPaths.templates,
            icon: 'BoltIcon' as IconName,
          },
          {
            children: 'Categories',
            link: settingsPaths.categories,
            icon: 'TagIcon' as IconName,
          },
          ...(roles?.includes(Role.TestUser)
            ? [
                {
                  children: 'Overwrite User Data',
                  link: settingsPaths.dataOverwrite,
                  icon: 'ExclamationTriangleIcon' as IconName,
                },
              ]
            : []),
        ],
      },
    ],
    [roles],
  );

  return (
    <section>
      <div className="grid gap-8">
        {urls.map(({ label, items }) => (
          <List key={label} label={label} hasItemRoundness>
            {items.map((item) => (
              <ProminentLink key={item.link} {...item} />
            ))}
          </List>
        ))}
        <div>
          <Heading>Theme</Heading>
          <ThemeSwitcher />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-12 sm:flex-row">
        <HardRefreshButton />
        <Button accentColor="secondary" href="/auth/logout">
          Sign out
        </Button>
      </div>
    </section>
  );
};
