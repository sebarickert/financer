import React from "react";

interface IProps {
  children: string;
}

const StatsHeader = ({ children }: IProps): JSX.Element => {
  return (
    <h2 className="text-2xl leading-9 font-bold tracking-tight text-gray-900 mb-2 sm:mb-0 sm:leading-none">
      {children}
    </h2>
  );
};

export default StatsHeader;
