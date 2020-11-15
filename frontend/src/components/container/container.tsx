import React from "react";

interface IProps {
  className?: string;
  children: React.ReactNode;
}

const Container = ({ className = "", children }: IProps): JSX.Element => {
  return (
    <div className={`mx-auto px-4 max-w-screen-md ${className}`}>
      {children}
    </div>
  );
};

export default Container;
