import { Container } from './container/container';

import { ToastContainer } from '$blocks/toast/toast.container';
import { Header } from '$layouts/Header';
import { Header as SecondaryHeader } from '$layouts/header/header';

type LayoutProps = {
  title: string;
  children: React.ReactNode;
};

export const Layout = ({ children, title }: LayoutProps): JSX.Element => {
  return (
    <div>
      <Header />
      <Container>
        <main className="max-lg:min-h-screen-safe pb-safe">
          <div
            className="px-4 max-lg:mt-[64px] lg:mt-[82px] max-lg:pt-8 max-lg:pb-24 lg:px-8 lg:py-12"
            data-testid="layout-root"
          >
            <SecondaryHeader title={title} />
            <ToastContainer className="mb-8 -mt-2" />
            {children}
          </div>
        </main>
      </Container>
    </div>
  );
};
