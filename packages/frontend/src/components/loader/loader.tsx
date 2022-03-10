import { Loader as OrinalLoader } from '@silte/react-loader';
import React from 'react';

export interface ILoaderProps {
  loaderColor?: 'pink' | 'red' | 'green' | 'blue';
  className?: string;
}

export const Loader = ({
  loaderColor = 'pink',
  className = '',
}: ILoaderProps): JSX.Element => {
  const colorCode = {
    blue: '#1f78f0',
    green: '#38a169',
    pink: '#d53f8c',
    red: '#e53e3e',
  };

  const loaderColorReal = loaderColor.length > 0 ? colorCode[loaderColor] : '';

  return (
    <OrinalLoader
      className={`flex justify-center items-center mx-auto ${className}`}
      loaderColor={loaderColorReal}
    />
  );
};
