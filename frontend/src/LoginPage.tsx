import React from "react";
import Container from "./components/container/container";
import SEO from "./components/seo/seo";
import Login from "./components/login/login";

const LoginPage = (): JSX.Element => {
  return (
    <>
      <SEO title="Login" />
      <Container>
        <Login label="Financer" submitButtonLabel="Login with Github">
          Please login to manage your accounts, expenses and incomes.
        </Login>
      </Container>
    </>
  );
};

export default LoginPage;
