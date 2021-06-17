import React from "react";
import Loader, { ILoaderProps } from "./loader";

const LoaderFullScreen = ({
  loaderColor = "pink",
}: ILoaderProps): JSX.Element => (
  <div className="z-50 fixed inset-0 w-full h-full flex items-center">
    <div className="fixed inset-0 transition-opacity">
      <div className="absolute inset-0 bg-gray-500 opacity-50" />
    </div>
    <div className="w-full">
      <Loader loaderColor={loaderColor} />
    </div>
  </div>
);

export default LoaderFullScreen;
