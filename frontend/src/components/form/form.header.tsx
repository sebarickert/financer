import React from "react";

interface IProps {
  children: React.ReactNode;
}

const FormHeader = ({ children }: IProps): JSX.Element => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
        {children}
      </h2>
    </div>
  );
};

export default FormHeader;
