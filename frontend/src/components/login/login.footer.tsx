import React from "react";
import { Link } from "react-router-dom";
import Button from "../button/button";

interface IProps {
  className: string;
}

const LoginFooter = ({ className = "" }: IProps): JSX.Element => {
  return (
    <div className={`bg-white py-3 ${className}`}>
      <Link
        to="/privacy-policy"
        className="text-sm focus:outline-none focus:ring-2 focus:ring-offset-4 rounded-sm"
      >
        Privacy policy
      </Link>
    </div>
  );
};

export default LoginFooter;
