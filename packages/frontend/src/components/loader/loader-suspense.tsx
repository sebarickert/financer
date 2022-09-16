import { Suspense } from 'react';

import { Loader } from './loader';

type LoaderSuspenseProps = {
  children: React.ReactNode;
};

export const LoaderSuspense = ({ children }: LoaderSuspenseProps) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);
