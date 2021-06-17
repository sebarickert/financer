import React from "react";
import ButtonPlain from "./button.plain";
import ButtonExternal from "./button.external";
import ButtonInternal from "./button.internal";

type AccentColor = "pink" | "red" | "green" | "blue" | "plain";
interface IProps {
  accentColor?: AccentColor;
  children: string;
  className?: string;
  link?: string;
  onClick?(): void;
  type?: "button" | "submit" | "reset" | undefined;
  size?: "small" | "medium" | "large";
}

export const isExternalLink = (link: string): boolean =>
  link.substr(0, 8) === "https://" ||
  link.substr(0, 7) === "http://" ||
  link.substr(0, 2) === "//" ||
  link.substr(0, 5) === "blob:" ||
  link.substr(0, 5) === "/api/" ||
  link.substr(0, 6) === "/auth/";

const getButtonColorClasses = (color: AccentColor): string => {
  switch (color) {
    case "blue":
      return "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-500";
    case "green":
      return "bg-green-600 hover:bg-green-500 active:bg-green-700 focus:ring-green-500";
    case "red":
      return "bg-red-600 hover:bg-red-500 active:bg-red-700 focus:ring-red-500";
    case "pink":
      return "bg-pink-600 hover:bg-pink-500 active:bg-pink-700 focus:ring-pink-500";
    default:
      return "";
  }
};

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
    small: "sm:text-sm leading-5",
    medium: "leading-6",
    large: "sm:text-lg leading-7",
  };

  const elementClasses = [
    `inline-flex justify-center w-full sm:w-auto items-center px-4 py-2 border font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 text-base ${fontSizeMapping[size]} ${className}`,
  ];

  if (accentColor === "plain") {
    elementClasses.push(
      `border-gray-300 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:ring-blue-500`
    );
  } else {
    elementClasses.push(
      `border-transparent ${getButtonColorClasses(accentColor)}`
    );
  }

  if (typeof link === "string" && link.length > 0) {
    if (isExternalLink(link)) {
      return (
        <ButtonExternal
          link={link}
          className={elementClasses.join(" ")}
          onClick={onClick}
        >
          {children}
        </ButtonExternal>
      );
    }

    return (
      <ButtonInternal
        link={link}
        className={elementClasses.join(" ")}
        onClick={onClick}
      >
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
