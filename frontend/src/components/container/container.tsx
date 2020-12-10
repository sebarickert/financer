import React from "react";
import Sidebar from "../sidebar/sidebar";

interface IProps {
  className?: string;
  children: React.ReactNode;
  sidebarComponent?: React.ReactNode;
}

const Container = ({
  className = "",
  children,
  sidebarComponent,
}: IProps): JSX.Element => {
  return (
    <div
      className={`mx-auto px-4 max-w-screen-xl ${className} ${
        sidebarComponent ? "lg:flex" : ""
      }`}
    >
      {sidebarComponent && <Sidebar>{sidebarComponent}</Sidebar>}
      {sidebarComponent ? (
        <div className="lg:flex-1">{children}</div>
      ) : (
        children
      )}
    </div>
  );
};

export default Container;
