import React from "react";
import IconSwitchHorizontal from "./icon.switchHorizontal";
import IconPlusCircle from "./icon.plusCircle";
import IconMinusCircle from "./icon.minusCircle";
import IconHome from "./icon.home";
import IconUser from "./icon.user";

export type IconName =
  | "switch-horizontal"
  | "plus-circle"
  | "minus-circle"
  | "home"
  | "user";
interface IconProps {
  type: IconName;
}

const Icon = ({ type }: IconProps): JSX.Element => {
  const defaultIconClasses = "h-6 w-6";

  switch (type) {
    case "switch-horizontal":
      return <IconSwitchHorizontal className={defaultIconClasses} />;

    case "plus-circle":
      return <IconPlusCircle className={defaultIconClasses} />;

    case "minus-circle":
      return <IconMinusCircle className={defaultIconClasses} />;

    case "home":
      return <IconHome className={defaultIconClasses} />;

    case "user":
      return <IconUser className={defaultIconClasses} />;

    default:
      break;
  }

  return <div />;
};

export default Icon;
