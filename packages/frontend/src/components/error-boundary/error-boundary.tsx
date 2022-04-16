import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

import { ErrorPage } from '../error-page/error-page';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  errorPage: 'full-app' | 'in-app';
};

export const ErrorBoundaryHandler = ({
  children,
  errorPage,
}: ErrorBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
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
