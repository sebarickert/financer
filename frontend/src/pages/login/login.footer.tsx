import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  className: string;
}

const LoginFooter = ({ className = "" }: IProps): JSX.Element => {
  return (
    <div
      className={`bg-white py-3 flex flex-col sm:flex-row sm:justify-center sm:items-center ${className}`}
    >
      <Link
        to="/privacy-policy"
        className="text-sm focus:outline-none focus:ring-2 focus:ring-offset-4 rounded-sm"
      >
        Privacy policy
      </Link>
      <span className="hidden px-1 mx-1 sm:inline-block">|</span>
      <Link
        to="/issues-with-login"
        className="text-sm focus:outline-none focus:ring-2 focus:ring-offset-4 rounded-sm mt-2 sm:mt-0"
      >
        Issues with login?
      </Link>
    </div>
  );
};

export default LoginFooter;
