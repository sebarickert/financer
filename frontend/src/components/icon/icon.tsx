import React from "react";
import IconSwitchHorizontal from "./icon.switchHorizontal";
import IconPlusCircle from "./icon.plusCircle";

interface IconProps {
  type: "switch-horizontal" | "plus-circle";
}

const Icon = ({ type }: IconProps): JSX.Element => {
  switch (type) {
    case "switch-horizontal":
      return <IconSwitchHorizontal />;

    case "plus-circle":
      return <IconPlusCircle />;

    default:
      break;
  }

  return <div />;
};

export default Icon;
