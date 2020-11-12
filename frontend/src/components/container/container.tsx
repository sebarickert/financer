import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Container = ({ children }: IProps): JSX.Element => {
  return <div className="mx-auto px-4 max-w-screen-md">{children}</div>;
};

export default Container;
