import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
  href: string;
  accentColor?: "pink" | "red" | "green" | "blue";
}

const Button = ({
  children,
  href,
  accentColor = "pink",
}: IProps): JSX.Element => {
  return (
    <span className="inline-flex rounded-md shadow-sm">
      <Link
        to={href}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-${accentColor}-600 hover:bg-${accentColor}-500 focus:outline-none focus:border-${accentColor}-700 focus:shadow-outline-${accentColor} active:bg-${accentColor}-700 transition ease-in-out duration-150`}
      >
        {children}
      </Link>
    </span>
  );
};

export default Button;
