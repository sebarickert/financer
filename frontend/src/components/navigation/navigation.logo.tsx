import React from "react";
import { ReactComponent as Logo } from "../../assets/logo.svg";

const NavigationLogo = (): JSX.Element => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Logo className="block h-10 w-auto" />
    </div>
  );
};

export default NavigationLogo;
