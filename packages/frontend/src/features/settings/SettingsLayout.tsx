import { FC } from 'react';

import { settingsContextualNavigationItems } from '$constants/settingsContextualNavigationItems';
import { Layout } from '$layouts/Layout';

type SettingsLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const SettingsLayout: FC<SettingsLayoutProps> = async ({
  title,
  children,
}) => {
  return (
    <Layout
      title={title}
      contextualNavigationItems={settingsContextualNavigationItems}
    >
      {children}
    </Layout>
  );
};
