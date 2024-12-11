import { FC } from 'react';

import { settingsContextualNavigationItems } from '$constants/settingsContextualNavigationItems';
import { Layout, LayoutProps } from '$layouts/Layout';

type SettingsLayoutProps = Omit<LayoutProps, 'contextualNavigationItems'>;

export const SettingsLayout: FC<SettingsLayoutProps> = async ({
  children,
  ...rest
}) => {
  return (
    <Layout
      contextualNavigationItems={settingsContextualNavigationItems}
      {...rest}
    >
      {children}
    </Layout>
  );
};
