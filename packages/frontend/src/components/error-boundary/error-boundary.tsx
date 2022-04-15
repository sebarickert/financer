import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from 'react-query';

import { Button } from '../button/button';
import { Container } from '../container/container';
import { Heading } from '../heading/heading';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

export const ErrorBoundaryHandler = ({ children }: ErrorBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <Container>
          <Heading>Oops, something went wrong!</Heading>
          <Button onClick={() => resetErrorBoundary()}>Please try again</Button>
        </Container>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};