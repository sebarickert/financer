import React from 'react';

interface IFormHeaderProps {
  children: React.ReactNode;
}

export const FormHeader = ({ children }: IFormHeaderProps): JSX.Element => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
        {children}
      </h2>
    </div>
  );
};
