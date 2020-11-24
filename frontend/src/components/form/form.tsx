import React from "react";
import FormFooter from "./form.footer";
import FormHeader from "./form.header";

interface IProps {
  children: React.ReactNode;
  formHeading: string;
  submitLabel: string;
  accentColor?: "pink" | "red" | "green" | "blue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit(event: any): void;
}

const Form = ({
  children,
  submitLabel,
  formHeading,
  handleSubmit,
  accentColor = "blue",
}: IProps): JSX.Element => {
  return (
    <form onSubmit={handleSubmit} method="post">
      <FormHeader>{formHeading}</FormHeader>
      {children}
      <FormFooter submitLabel={submitLabel} accentColor={accentColor} />
    </form>
  );
};

export default Form;
