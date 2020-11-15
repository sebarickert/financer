import React from "react";
import Container from "../container/container";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ className, children }: IProps): JSX.Element => {
  return (
    <>
      <Container className={className}>{children}</Container>
    </>
  );
};

export default Layout;
