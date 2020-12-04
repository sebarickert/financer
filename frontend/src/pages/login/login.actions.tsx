import React from "react";
import Button from "../../components/button/button";

interface IProps {
  submitButtonLabel: string;
  loginUrl: string;
}

const LoginActions = ({ submitButtonLabel, loginUrl }: IProps): JSX.Element => {
  return (
    <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
      <Button link={loginUrl}>{submitButtonLabel}</Button>
    </div>
  );
};

export default LoginActions;
