import React from "react";
import Button from "../../components/button/button";

interface IProps {
  submitButtonLabel: string;
  loginUrl: string;
}

const LoginActions = ({ submitButtonLabel, loginUrl }: IProps): JSX.Element => {
  return (
    <div className="bg-gray-900 py-3 px-6 flex justify-end">
      <Button link={loginUrl}>{submitButtonLabel}</Button>
    </div>
  );
};

export default LoginActions;
