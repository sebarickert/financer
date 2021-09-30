import React from "react";
import DescriptionListBody from "./description-list.body";
import DescriptionListHeader from "./description-list.header";

interface IProps {
  label: string;
  className?: string;
  children: React.ReactNode;
  testId?: string;
  visibleLabel?: boolean;
}

const DescriptionList = ({
  label,
  className = "",
  children,
  testId,
  visibleLabel = false,
}: IProps): JSX.Element => {
  return (
    <div className={`${className}`} data-test-id={testId}>
      <DescriptionListHeader label={label} visibleLabel={visibleLabel} />
      <DescriptionListBody>{children}</DescriptionListBody>
    </div>
  );
};

export default DescriptionList;
