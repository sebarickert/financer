import React from "react";
import IconSwitchHorizontal from "./icon.switchHorizontal";
import IconPlusCircle from "./icon.plusCircle";
import IconMinusCircle from "./icon.minusCircle";

export type IconName = "switch-horizontal" | "plus-circle" | "minus-circle";
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

    default:
      break;
  }

  return <div />;
};

export default Icon;
