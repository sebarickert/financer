import clsx from 'clsx';

import { ToastContainer } from '$blocks/toast/toast.container';
import { ContentHeader } from '$layouts/ContentHeader';
import { Header } from '$layouts/Header';

type LayoutProps = {
  title: string;
  children: React.ReactNode;
  backLink?: string;
  headerAction?: React.ReactNode;
};

export const Layout = ({
  children,
  title,
  backLink,
  headerAction,
}: LayoutProps): JSX.Element => {
  return (
    <>
      <Header />
      <main
        className={clsx(
          'mt-[--gutter-top]',
          'pt-12 pb-safe-offset-12 px-4 lg:px-8',
          'mx-auto max-w-screen-xl',
        )}
        data-testid="layout-root"
      >
        <ContentHeader
          title={title}
          backLink={backLink}
          headerAction={headerAction}
        />
        <ToastContainer className="mb-8 -mt-2" />
        {children}
      </main>
    </>
  );
};
