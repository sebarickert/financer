import { Loader } from './loader';

type LoaderIfProcessingProps = {
  isProcessing: boolean;
  children: React.ReactNode;
};

export const LoaderIfProcessing = ({
  isProcessing,
  children,
}: LoaderIfProcessingProps): JSX.Element => {
  if (isProcessing) {
    return <Loader />;
  }

  return <>{children}</>;
};
