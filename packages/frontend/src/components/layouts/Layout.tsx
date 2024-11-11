import { Container } from './Container';

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
    <div>
      <Header />
      <Container>
        <main className="max-lg:min-h-screen-safe pb-safe">
          <div
            className="px-2 mt-[48px] lg:mt-[64px] max-lg:pt-4 max-lg:pb-24 lg:px-8 lg:py-12" // 48/64px is the height of the header
            data-testid="layout-root"
          >
            <ContentHeader
              title={title}
              backLink={backLink}
              headerAction={headerAction}
            />
            <ToastContainer className="mb-8 -mt-2" />
            {children}
          </div>
        </main>
      </Container>
    </div>
  );
};
