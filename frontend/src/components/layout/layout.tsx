import React from "react";
import Container from "../container/container";
import Navigation from "../navigation/navigation";

interface IProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ className, children }: IProps): JSX.Element => {
  return (
    <>
      <Navigation />
      <Container className={className}>{children}</Container>
    </>
  );
};

export default Layout;
