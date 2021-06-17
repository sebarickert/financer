import React from "react";
import Button from "../../components/button/button";

interface ILoginActionsProps {
  submitButtonLabel: string;
  loginUrl: string;
  onClick?(): void;
}

const LoginActions = ({
  submitButtonLabel,
  loginUrl,
  onClick = () => {},
}: ILoginActionsProps): JSX.Element => {
  return (
    <div className="bg-gray-900 py-3 px-6 flex justify-end">
      <Button link={loginUrl} onClick={onClick}>
        {submitButtonLabel}
      </Button>
    </div>
  );
};

export default LoginActions;
