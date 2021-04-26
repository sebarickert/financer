import React from "react";
import Navigation from "../navigation/navigation";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps): JSX.Element => {
  return (
    <>
      <Navigation />
      <main className="bg-gray-100 pb-16 lg:pb-24">{children}</main>
    </>
  );
};

export default Layout;
