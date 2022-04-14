import React from 'react';

import { Loader, ILoaderProps, LoaderColor } from './loader';

export const LoaderFullScreen = ({
  loaderColor = LoaderColor.pink,
}: ILoaderProps): JSX.Element => (
  <div className="fixed inset-0 z-50 flex items-center w-full h-full">
    <div className="fixed inset-0 transition-opacity">
      <div className="absolute inset-0 bg-gray-500 opacity-50" />
    </div>
    <div className="w-full">
      <Loader loaderColor={loaderColor} />
    </div>
  </div>
);
