import React from "react";
import { Loader as OrinalLoader } from "@silte/react-loader";

export interface ILoaderProps {
  loaderColor?: "pink" | "red" | "green" | "blue";
}

const Loader = ({ loaderColor = "pink" }: ILoaderProps): JSX.Element => {
  const colorCode = {
    blue: "#1f78f0",
    green: "#38a169",
    pink: "#d53f8c",
    red: "#e53e3e",
  };

  const loaderColorReal = loaderColor.length > 0 ? colorCode[loaderColor] : "";

  return (
    <OrinalLoader
      className="flex justify-center items-center mx-auto my-12 sm:my-20 md:my-28 lg:my-36"
      loaderColor={loaderColorReal}
    />
  );
};

export default Loader;
