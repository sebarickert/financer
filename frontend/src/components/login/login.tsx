import React from "react";
import LoginHeader from "./login.header";
import LoginActions from "./login.actions";
import SEO from "../seo/seo";
import LoginFooter from "./login.footer";

const Login = (): JSX.Element => {
  return (
    <>
      <SEO title="Login" />
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
          &#8203;
          <div
            className="inline-block align-bottom overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white rounded-lg text-left shadow-xl overflow-hidden">
              <LoginHeader label="Financer">
                Please login to manage your accounts, expenses and incomes.
              </LoginHeader>
              <LoginActions submitButtonLabel="Login with Github" />
            </div>
            <LoginFooter className="mt-2 overflow-hidden rounded-lg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
