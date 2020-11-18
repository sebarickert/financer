import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
}

const NavigationDesktop = ({ children }: IProps): JSX.Element => {
  return <div className="hidden sm:ml-6 sm:flex">{children}</div>;
};

export default NavigationDesktop;
