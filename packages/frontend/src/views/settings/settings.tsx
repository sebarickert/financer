import { FC, useMemo } from 'react';

import { Role } from '$api/generated/financerApi';
import { HardRefreshButton } from '$blocks/HardRefreshButton';
import { settingsPaths } from '$constants/settings-paths';
import { Button } from '$elements/button/button';
import { IconName } from '$elements/Icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface SettingsProps {
  roles?: Role[];
}

export const Settings: FC<SettingsProps> = ({ roles }) => {
  const urls = useMemo(
    () => [
      {
        label: 'Account',
        items: [
          {
            children: 'User preferences',
            link: settingsPaths.userPreferences,
            icon: 'UserCircleIcon' as IconName,
          },
          {
            children: 'Download my data',
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
                  children: 'Overrite data',
                  link: settingsPaths.dataOverride,
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
    <>
      <UpdatePageInfo />
      <section className="grid gap-8">
        {urls.map(({ label, items }) => (
          <LinkList key={label} label={label}>
            {items.map((item) => (
              <LinkListLink key={item.link} {...item} />
            ))}
          </LinkList>
        ))}
      </section>
      <div className="flex flex-col gap-2 mt-12 sm:flex-row">
        <HardRefreshButton />
        <Button accentColor="plain" href="/auth/logout" className="lg:hidden">
          Sign out
        </Button>
      </div>
    </>
  );
};
