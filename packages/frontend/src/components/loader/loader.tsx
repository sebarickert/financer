import { Loader as OrinalLoader } from '@silte/react-loader';

export enum LoaderColor {
  blue = '#1f78f0',
  green = '#38a169',
  pink = '#d53f8c',
  red = '#e53e3e',
}

export interface ILoaderProps {
  loaderColor?: LoaderColor;
  className?: string;
}

export const Loader = ({
  loaderColor = LoaderColor.pink,
  className = '',
}: ILoaderProps): JSX.Element => {
  const loaderColorReal = loaderColor.length > 0 ? loaderColor : '';

  return (
    <OrinalLoader
      className={`flex justify-center items-center mx-auto ${className}`}
      loaderColor={loaderColorReal}
    />
  );
};
