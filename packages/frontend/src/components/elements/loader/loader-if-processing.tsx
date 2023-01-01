import { Loader } from './loader';

type LoaderIfProcessingProps = {
  isLoading: boolean;
  children: React.ReactNode;
};

export const LoaderIfLoading = ({
  isLoading: isProcessing,
  children,
}: LoaderIfProcessingProps): JSX.Element => {
  if (isProcessing) {
    return <Loader />;
  }

  return <>{children}</>;
};
