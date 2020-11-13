import React from "react";
import FormFooter from "./form.footer";
import FormHeader from "./form.header";

interface IProps {
  children: React.ReactNode;
  formHeading: string;
  submitLabel: string;
  handleSubmit(event: any): void;
}

const Form = ({
  children,
  submitLabel,
  formHeading,
  handleSubmit,
}: IProps): JSX.Element => {
  return (
    <form onSubmit={handleSubmit} method="post">
      <FormHeader>{formHeading}</FormHeader>
      {children}
      <FormFooter submitLabel={submitLabel} accentColor="blue" />
    </form>
  );
};

export default Form;
