import React from "react";
import Navigation from "../navigation/navigation";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps): JSX.Element => {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
};

export default Layout;
