import clsx from 'clsx';
import type { JSX } from 'react';

import { ContextualNavigationItem } from '$blocks/ContextualNavigation';
import { ToastContainer } from '$blocks/Toast/ToastContainer';
import { ContentHeader } from '$layouts/ContentHeader';
import { Header } from '$layouts/Header';

export type LayoutProps = {
  title: string;
  children: React.ReactNode;
  backLink?: string;
  headerAction?: React.ReactNode;
  contextualNavigationItems?: ContextualNavigationItem[];
  isLoading?: boolean;
};

export const Layout = ({
  children,
  title,
  backLink,
  headerAction,
  contextualNavigationItems,
  isLoading,
}: LayoutProps): JSX.Element => {
  return (
    <>
      <Header isLoading={isLoading} />
      <main
        className={clsx(
          'pt-4 lg:pt-12 pb-safe-offset-12 px-4 lg:px-8',
          'mx-auto max-w-screen-xl',
          'mt-(--gutter-top)',
        )}
        data-testid="layout-root"
      >
        <ContentHeader
          title={title}
          backLink={backLink}
          headerAction={headerAction}
          contextualNavigationItems={contextualNavigationItems}
        />
        <ToastContainer className="mb-8 -mt-2" />
        {children}
      </main>
    </>
  );
};
