import React from 'react';

import { ReactComponent as Logo } from '../../assets/logo.svg';

interface ILoginHeaderProps {
  label: string;
  children: string;
}

export const LoginHeader = ({
  label,
  children,
}: ILoginHeaderProps): JSX.Element => {
  return (
    <div className="bg-gray-800 p-6 pb-4">
      <div className="flex items-start">
        <div className="h-10 w-10">
          <Logo className="h-10 w-10" />
        </div>
        <div className="mt-1 ml-4 text-left">
          <h1
            className="tracking-tight font-bold text-white text-2xl"
            id="modal-headline"
          >
            {label}
          </h1>
          <div className="mt-2">
            <p className="text-sm leading-5 text-gray-300">{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
