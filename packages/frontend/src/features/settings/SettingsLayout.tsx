import { FC } from 'react';

import { settingsContextualNavigationItems } from '$constants/settingsContextualNavigationItems';
import { Layout, LayoutProps } from '$layouts/Layout';

type SettingsLayoutProps = Omit<LayoutProps, 'contextualNavigationItems'>;

export const SettingsLayout: FC<SettingsLayoutProps> = async ({
  title,
  children,
  backLink,
  headerAction,
}) => {
  return (
    <Layout
      title={title}
      contextualNavigationItems={settingsContextualNavigationItems}
      backLink={backLink}
      headerAction={headerAction}
    >
      {children}
    </Layout>
  );
};
