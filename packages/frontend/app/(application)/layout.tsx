import clsx from 'clsx';
import { redirect } from 'next/navigation';

import { ToastContainer } from '@/blocks/Toast/ToastContainer';
import { Header } from '@/layouts/Header';
import { verifySession } from '@/utils/dal';

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = await verifySession();
  if (!isLoggedIn) return redirect('/login');

  return (
    <>
      <Header />
      <main
        className={clsx(
          'pt-12 pb-safe-offset-12 px-4 lg:px-8',
          'mx-auto max-w-screen-md lg:max-w-screen-xl',
          'mt-(--gutter-top)',
          'hero',
        )}
        data-testid="layout-root"
      >
        <ToastContainer className="mb-8 -mt-2" />
        {children}
      </main>
    </>
  );
}
