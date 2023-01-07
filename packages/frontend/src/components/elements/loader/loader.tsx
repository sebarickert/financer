import { ReactComponent as Logo } from '$assets/logo.svg';

type LoaderProps = {
  isLoading?: boolean;
  children?: React.ReactNode;
};

export const Loader = ({
  children = null,
  isLoading = true,
}: LoaderProps): JSX.Element => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Logo className="absolute block w-12 h-12 opacity-75 animate-ping" />
        <Logo className="relative block rounded h-14 w-14" />
      </div>
    );
  }

  return <>{children}</>;
};
