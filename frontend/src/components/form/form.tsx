import React from "react";
import FormFooter from "./form.footer";
import FormHeader from "./form.header";

interface IProps {
  children: React.ReactNode;
  formHeading: string;
  submitLabel: string;
}

const Form = ({ children, submitLabel, formHeading }: IProps): JSX.Element => {
  return (
    <form>
      <FormHeader>{formHeading}</FormHeader>
      {children}
      <FormFooter submitLabel={submitLabel} accentColor="blue" />
    </form>
  );
};

export default Form;
