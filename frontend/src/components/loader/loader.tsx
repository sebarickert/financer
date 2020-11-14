import React from "react";
import "./loader.css";

interface IProps {
  loaderColor?: "pink" | "red" | "green" | "blue";
}

const Loader = ({ loaderColor = "pink" }: IProps): JSX.Element => {
  const colorCode = {
    blue: "#3182ce",
    green: "#38a169",
    pink: "#d53f8c",
    red: "#e53e3e",
  };

  return (
    <div className="loader flex justify-center items-center mx-auto my-12 sm:my-20 md:my-28 lg:my-36">
      <div style={{ borderTopColor: colorCode[loaderColor] }} />
      <div style={{ borderTopColor: colorCode[loaderColor] }} />
      <div style={{ borderTopColor: colorCode[loaderColor] }} />
      <div style={{ borderTopColor: colorCode[loaderColor] }} />
    </div>
  );
};

export default Loader;
