import React from "react";
import Navigation from "../navigation/navigation";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="bg-gray-100 pb-16 lg:pb-24 flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
