import React from "react";
import { Link } from "react-router-dom";
import Container from "../container/container";

interface IProps {
  children: React.ReactNode;
}

const NavigationContainer = ({ children }: IProps): JSX.Element => {
  return (
    <nav className="bg-white shadow mb-6 sm:mb-12">
      <Container>{children}</Container>
    </nav>
  );
};

export default NavigationContainer;
