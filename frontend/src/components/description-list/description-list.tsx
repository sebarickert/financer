import React from "react";
import Container from "../container/container";
import DescriptionListBody from "./description-list.body";
import DescriptionListHeader from "./description-list.header";

interface IProps {
  label: string;
  className?: string;
  children: React.ReactNode;
  testId?: string;
}

const DescriptionList = ({
  label,
  className = "",
  children,
  testId,
}: IProps): JSX.Element => {
  return (
    <Container>
      <div
        className={`bg-white border border-gray-200 overflow-hiddeN ${className}`}
        data-test-id={testId}
      >
        <DescriptionListHeader label={label} />
        <DescriptionListBody>{children}</DescriptionListBody>
      </div>
    </Container>
  );
};

export default DescriptionList;
