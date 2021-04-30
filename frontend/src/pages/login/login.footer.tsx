import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  className: string;
}

const LoginFooter = ({ className = "" }: IProps): JSX.Element => {
  return (
    <div
      className={`bg-gray-900 py-3 pr-3 grid grid-cols-2 items-center justify-center ${className}`}
    >
      <Link to="/privacy-policy" className="text-sm  text-gray-400">
        Privacy policy
      </Link>
      <Link to="/issues-with-login" className="text-sm  text-gray-400">
        Issues with login?
      </Link>
    </div>
  );
};

export default LoginFooter;
