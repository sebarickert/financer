import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '$assets/logo.svg';

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
        <Image
          src={logo}
          className="absolute block w-12 h-12 opacity-75 animate-ping"
          alt="logo"
        />
        <Image
          src={logo}
          className="relative block rounded h-14 w-14"
          alt="logo"
        />
      </div>
    );
  }

  return <>{children}</>;
};
