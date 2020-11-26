import React from "react";
import { ReactComponent as Logo } from "../../assets/logo.svg";

interface IProps {
  label: string;
  children: string;
}

const LoginHeader = ({ label, children }: IProps): JSX.Element => {
  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
          <Logo className="h-10 w-10" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h1
            className="uppercase tracking-wider font-bold text-2xl"
            id="modal-headline"
          >
            {label}
          </h1>
          <div className="mt-2">
            <p className="text-sm leading-5 text-gray-500">{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;
