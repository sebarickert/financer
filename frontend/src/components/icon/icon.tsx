import React from "react";
import IconSwitchHorizontal from "./icon.switchHorizontal";
import IconPlusCircle from "./icon.plusCircle";
import IconMinusCircle from "./icon.minusCircle";
import IconHome from "./icon.home";
import IconUser from "./icon.user";
import IconChartBar from "./icon.chartBar";
import IconViewGrid from "./icon.viewGrid";
import IconUserCircle from "./icon.userCircle";
import IconPlus from "./icon.plus";
import IconDownload from "./icon.download";
import IconUpload from "./icon.upload";
import IconLogout from "./icon.logout";

export type IconName =
  | "switch-horizontal"
  | "plus-circle"
  | "minus-circle"
  | "home"
  | "user"
  | "chart-bar"
  | "view-grid"
  | "user-circle"
  | "plus"
  | "download"
  | "upload"
  | "logout";
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

    case "chart-bar":
      return <IconChartBar className={defaultIconClasses} />;

    case "view-grid":
      return <IconViewGrid className={defaultIconClasses} />;

    case "user-circle":
      return <IconUserCircle className={defaultIconClasses} />;

    case "plus":
      return <IconPlus className={defaultIconClasses} />;

    case "download":
      return <IconDownload className={defaultIconClasses} />;

    case "upload":
      return <IconUpload className={defaultIconClasses} />;

    case "logout":
      return <IconLogout className={defaultIconClasses} />;

    default:
      break;
  }

  return <div />;
};

export default Icon;
