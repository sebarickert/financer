import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: IProps): JSX.Element => {
  return (
    <div className="mb-12 lg:flex lg:flex-shrink-0 lg:w-64 lg:mr-12 lg:mb-0">
      {children}
    </div>
  );
};

export default Sidebar;
