import React from "react";
import Button from "./components/button/button";
import Container from "./components/container/container";
import SEO from "./components/seo/seo";

const Login = (): JSX.Element => {
  return (
    <>
      <SEO title="Login" />
      <Container className="mt-12 flex justify-center">
        <Button link="/api/auth/github">Login with Github</Button>
      </Container>
    </>
  );
};

export default Login;
