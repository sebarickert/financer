import clsx from 'clsx';
import type { JSX } from 'react';

import { ToastContainer } from '@/blocks/Toast/ToastContainer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { Header } from '@/layouts/Header';

export interface LayoutProps {
  title: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const Layout = ({
  children,
  title,
  headerAction,
}: LayoutProps): JSX.Element => {
  return (
    <>
      <Header />
      <main
        className={clsx(
          'pt-6 lg:pt-12 pb-safe-offset-12 px-4 lg:px-8',
          'mx-auto max-w-screen-xl',
          'mt-(--gutter-top)',
        )}
        data-testid="layout-root"
      >
        <ContentHeader title={title} action={headerAction} />
        <ToastContainer className="mb-8 -mt-2" />
        {children}
      </main>
    </>
  );
};
