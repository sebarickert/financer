interface NotificationContentProps {
  label: string;
  children: string;
}

export const NotificationContent = ({
  label,
  children,
}: NotificationContentProps): JSX.Element => {
  return (
    <div className="">
      <h3 className="text-sm font-medium leading-5 text-red-800">{label}</h3>
      <p className="mt-1 text-sm text-gray-500">{children}</p>
    </div>
  );
};
