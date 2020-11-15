import React from "react";
import Button from "./components/button/button";
import Layout from "./components/layout/layout";

const Login = (): JSX.Element => {
  return (
    <Layout className="mt-12 flex justify-center">
      <Button link="/api/auth/github">Login with Github</Button>
    </Layout>
  );
};

export default Login;
