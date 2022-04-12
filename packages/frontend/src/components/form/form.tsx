import React from 'react';

import { FormFooter } from './form.footer';

interface IFormProps {
  children: React.ReactNode;
  submitLabel: string;
  accentColor?: 'red' | 'green' | 'blue';
  formFooterBackLink?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit(event: any): void;
  optionalFooterComponent?: React.ReactNode;
}

export const Form = ({
  children,
  submitLabel,
  handleSubmit,
  accentColor = 'blue',
  formFooterBackLink,
  optionalFooterComponent,
}: IFormProps): JSX.Element => {
  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      className="pb-[83px] lg:pb-0"
      lang="en-150"
    >
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
