import { Suspense } from 'react';

import { Loader, LoaderColor } from './loader';

type LoaderSuspenseProps = {
  children: React.ReactNode;
  loaderColor?: LoaderColor;
};

export const LoaderSuspense = ({
  children,
  loaderColor = LoaderColor.blue,
}: LoaderSuspenseProps) => (
  <Suspense fallback={<Loader loaderColor={loaderColor} />}>
    {children}
  </Suspense>
);
