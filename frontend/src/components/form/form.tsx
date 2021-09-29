import React from "react";
import FormFooter from "./form.footer";
import FormHeader from "./form.header";

interface IProps {
  children: React.ReactNode;
  formHeading: string;
  submitLabel: string;
  accentColor?: "red" | "green" | "blue";
  formFooterBackLink?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit(event: any): void;
  optionalFooterComponent?: React.ReactNode;
}

const Form = ({
  children,
  submitLabel,
  formHeading,
  handleSubmit,
  accentColor = "blue",
  formFooterBackLink,
  optionalFooterComponent,
}: IProps): JSX.Element => {
  return (
    <form onSubmit={handleSubmit} method="post">
      <FormHeader>{formHeading}</FormHeader>
      {children}
      <FormFooter
        submitLabel={submitLabel}
        accentColor={accentColor}
        formFooterBackLink={formFooterBackLink}
        optionalComponent={optionalFooterComponent}
      />
    </form>
  );
};

export default Form;
