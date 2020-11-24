import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo.svg";

const NavigationLogo = (): JSX.Element => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link to="/">
        <Logo className="block h-10 w-auto" />
      </Link>
    </div>
  );
};

export default NavigationLogo;
