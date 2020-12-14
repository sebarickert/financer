import React from "react";

interface INotificationContentProps {
  label: string;
  children: string;
}

const NotificationContent = ({
  label,
  children,
}: INotificationContentProps): JSX.Element => {
  return (
    <div className="ml-3 w-0 flex-1 pt-0.5">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="mt-1 text-sm text-gray-500">{children}</p>
    </div>
  );
};

export default NotificationContent;
