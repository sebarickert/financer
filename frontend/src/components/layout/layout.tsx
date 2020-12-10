import React from "react";
import Navigation from "../navigation/navigation";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ className = "", children }: IProps): JSX.Element => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default Layout;
