import React from "react";

interface IProps {
  children?: React.ReactNode[] | React.ReactNode;
}

const NavigationMobileMenu = ({ children }: IProps): JSX.Element => {
  return <div className="pt-2 pb-3">{children}</div>;
};

export default NavigationMobileMenu;
