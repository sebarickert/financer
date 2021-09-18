import React from "react";
import MobileNavigation from "../mobile-navigation/mobile-navigation";
import Navigation from "../navigation/navigation";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navigation /> */}
      <main className="bg-gray-100 lg:pb-24 flex-grow">{children}</main>
      <MobileNavigation />
    </div>
  );
};

export default Layout;
