import React from "react";

interface IProps {
  label: string;
  testId?: string;
  visibleLabel: boolean;
}

const DescriptionListHeader = ({
  label,
  testId,
  visibleLabel,
}: IProps): JSX.Element => {
  return (
    <div className="pb-2" data-test-id={testId}>
      <h3
        className={`text-lg leading-6 font-medium text-gray-900 ${
          !visibleLabel && "sr-only"
        }`}
      >
        {label}
      </h3>
    </div>
  );
};

export default DescriptionListHeader;
