import React from "react";
import ButtonPlain from "./button.plain";
import ButtonExternal from "./button.external";
import ButtonInternal from "./button.internal";

interface IProps {
  accentColor?: "pink" | "red" | "green" | "blue" | "plain";
  children: string;
  className?: string;
  link?: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset" | undefined;
  size?: "small" | "medium" | "large";
}

const Button = ({
  accentColor = "blue",
  children,
  className = "",
  link,
  onClick = () => {},
  type = "button",
  size = "medium",
}: IProps): JSX.Element => {
  const fontSizeMapping = {
    small: "text-sm leading-5",
    medium: "text-base leading-6",
    large: "text-lg leading-7",
  };

  const elementClasses = [
    `inline-flex items-center px-4 py-2 border font-medium rounded-md text-white focus:outline-none transition ease-in-out duration-150 ${fontSizeMapping[size]} ${className}`,
  ];

  if (accentColor === "plain") {
    elementClasses.push(
      `border-gray-300 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue`
    );
  } else {
    elementClasses.push(
      `bg-${accentColor}-600 hover:bg-${accentColor}-500 focus:border-${accentColor}-700 focus:shadow-outline-${accentColor} active:bg-${accentColor}-700 border-transparent`
    );
  }

  if (typeof link === "string" && link.length > 0) {
    if (
      link.substr(0, 8) === "https://" ||
      link.substr(0, 7) === "http://" ||
      link.substr(0, 2) === "//" ||
      link.substr(0, 5) === "blob:" ||
      link.substr(0, 5) === "/api/"
    ) {
      return (
        <ButtonExternal link={link} className={elementClasses.join(" ")}>
          {children}
        </ButtonExternal>
      );
    }

    return (
      <ButtonInternal link={link} className={elementClasses.join(" ")}>
        {children}
      </ButtonInternal>
    );
  }

  return (
    <ButtonPlain
      type={type}
      onClick={onClick}
      className={elementClasses.join(" ")}
    >
      {children}
    </ButtonPlain>
  );
};

export default Button;
