import { Loader, LoaderColor } from './loader';

type LoaderIfProcessingProps = {
  isProcessing: boolean;
  children: React.ReactNode;
  loaderColor?: LoaderColor;
};

export const LoaderIfProcessing = ({
  isProcessing,
  children,
  loaderColor = LoaderColor.blue,
}: LoaderIfProcessingProps): JSX.Element => {
  if (isProcessing) {
    return <Loader loaderColor={loaderColor} />;
  }

  return <>{children}</>;
};
