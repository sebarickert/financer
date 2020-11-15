import React from "react";
import ButtonPlain from "./button.plain";
import ButtonExternal from "./button.external";
import ButtonInternal from "./button.internal";

interface IProps {
  accentColor?: "pink" | "red" | "green" | "blue";
  children: string;
  className?: string;
  link?: string;
  onClick?(): void;
}

const Button = ({
  accentColor = "blue",
  children,
  className = "",
  link,
  onClick = () => {},
}: IProps): JSX.Element => {
  const elementClasses = `inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-${accentColor}-600 hover:bg-${accentColor}-500 focus:outline-none focus:border-${accentColor}-700 focus:shadow-outline-${accentColor} active:bg-${accentColor}-700 transition ease-in-out duration-150 ${className}`;

  if (typeof link === "string" && link.length > 0) {
    if (
      link.substr(0, 8) === "https://" ||
      link.substr(0, 7) === "http://" ||
      link.substr(0, 2) === "//" ||
      link.substr(0, 5) === "blob:" ||
      link.substr(0, 5) === "/api/"
    ) {
      return (
        <ButtonExternal link={link} className={elementClasses}>
          {children}
        </ButtonExternal>
      );
    }

    return (
      <ButtonInternal link={link} className={elementClasses}>
        {children}
      </ButtonInternal>
    );
  }

  return (
    <ButtonPlain onClick={onClick} className={elementClasses}>
      {children}
    </ButtonPlain>
  );
};

export default Button;
