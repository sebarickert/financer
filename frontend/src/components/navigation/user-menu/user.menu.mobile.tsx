import React from "react";

interface IProps {
  children: React.ReactNode;
}

const UserMenuMobile = ({ children }: IProps): JSX.Element => {
  return (
    <div className="pt-4 pb-3 border-t border-gray-200">
      <div className="mt-3">{children}</div>
    </div>
  );
};

export default UserMenuMobile;
