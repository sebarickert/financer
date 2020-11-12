import React from "react";
import Container from "../container/container";

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps): JSX.Element => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};

export default Layout;
