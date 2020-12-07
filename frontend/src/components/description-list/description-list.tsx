import React from "react";
import DescriptionListBody from "./description-list.body";
import DescriptionListHeader from "./description-list.header";

interface IProps {
  label: string;
  className?: string;
  children: React.ReactNode;
}

const DescriptionList = ({
  label,
  className = "",
  children,
}: IProps): JSX.Element => {
  return (
    <div
      className={`py-8 px-4 -mx-4 bg-gray-100 md:rounded-lg md:-mx-5 md:px-5 lg:-mx-8 lg:px-8 ${className}`}
    >
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <DescriptionListHeader label={label} />
        <DescriptionListBody>{children}</DescriptionListBody>
      </div>
    </div>
  );
};

export default DescriptionList;
