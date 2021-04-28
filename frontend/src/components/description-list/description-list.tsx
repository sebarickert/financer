import React from "react";
import Container from "../container/container";
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
    <Container>
      <div
        className={`bg-white border border-gray-200 overflow-hiddeN ${className}`}
      >
        <DescriptionListHeader label={label} />
        <DescriptionListBody>{children}</DescriptionListBody>
      </div>
    </Container>
  );
};

export default DescriptionList;
