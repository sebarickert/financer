import React from "react";

interface IProps {
  label: string;
  children?: string;
}

const DescriptionListHeader = ({
  label,
  children = "",
}: IProps): JSX.Element => {
  return (
    <div className="px-4 py-5">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{label}</h3>
      {children && (
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{children}</p>
      )}
    </div>
  );
};

export default DescriptionListHeader;
