import { ButtonAccentColor } from '../../elements/button/button';

import { FormFooter } from './form.footer';

interface FormProps {
  children: React.ReactNode;
  submitLabel: string;
  accentColor?: ButtonAccentColor;
  formFooterBackLink?: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  optionalFooterComponent?: React.ReactNode;
}

export const Form = ({
  children,
  submitLabel,
  handleSubmit,
  accentColor = 'black',
  formFooterBackLink,
  optionalFooterComponent,
}: FormProps): JSX.Element => {
  return (
    <form onSubmit={handleSubmit} method="post" className="pb-[83px] lg:pb-0">
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
