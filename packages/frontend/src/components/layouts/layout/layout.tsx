import clsx from 'clsx';
import Image from 'next/image';

import { Container } from '../container/container';

import { Navigation } from '$blocks/navigation/navigation';
import { ToastContainer } from '$blocks/toast/toast.container';
import { Link } from '$elements/link/link';
import { Header } from '$layouts/header/header';

type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const Layout = ({ children, title }: LayoutProps): JSX.Element => {
  return (
    <div className="lg:bg-white">
      <Container
        className={clsx(
          'lg:grid grid-cols-[300px,1fr] min-h-screen px-0',
          'flex flex-col h-full max-lg:overflow-y-scroll',
        )}
      >
        <aside
          className={clsx(
            'hidden lg:block ',
            'relative border-r border-gray-dark',
            'after:bg-gray after:ml-[-100vw] after:pr-[100vw] after:absolute after:top-0 after:bottom-0 after:right-0',
          )}
        >
          <div className="sticky top-0 z-10 min-h-screen pt-12 pb-12 pl-8 pr-4 bottom-12">
            <header>
              <Link href="/" className="inline-flex items-center gap-3 mb-8">
                <Image
                  src="/logo.svg"
                  alt="Financer logo"
                  className="w-12 h-12"
                  width={48}
                  height={48}
                />

                <h2 className="text-xl font-extrabold tracking-tighter text-black uppercase">
                  Financer
                </h2>
              </Link>
              <Navigation variant="desktop" />
            </header>
          </div>
        </aside>
        <main className="max-lg:flex-grow max-lg:bg-white max-lg:min-h-screen-safe pb-safe">
          <div
            className="px-4 max-lg:mt-[64px] max-lg:pt-8 max-lg:pb-24 lg:px-8 lg:py-12"
            data-testid="layout-root"
          >
            <Header title={title} />
            <ToastContainer className="mb-8 -mt-2" />
            {children}
          </div>
        </main>
        <header className="lg:hidden">
          <Navigation variant="mobile" />
        </header>
      </Container>
    </div>
  );
};
