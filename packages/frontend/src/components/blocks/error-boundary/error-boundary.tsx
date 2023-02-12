import { ErrorBoundary } from 'react-error-boundary';

import { ErrorPage } from '../../pages/error-page/error-page';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  errorPage: 'full-app' | 'in-app';
};

export const ErrorBoundaryHandler = ({
  children,
  errorPage,
}: ErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      onReset={() => console.log("Resetting the error boundary's state")}
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorPage
          resetErrorBoundary={resetErrorBoundary}
          errorPageType={errorPage}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
