import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';

import { ButtonAccentColor } from '../../elements/button/button';

import { FormFooter } from './form.footer';

interface FormProps<FormValues extends FieldValues> {
  children: React.ReactNode;
  submitLabel: string;
  accentColor?: ButtonAccentColor;
  formFooterBackLink?: string;
  methods: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  id?: string;
  optionalFooterComponent?: React.ReactNode;
}

export const Form = <T extends FieldValues>({
  children,
  submitLabel,
  onSubmit,
  accentColor = 'black',
  formFooterBackLink,
  optionalFooterComponent,
  id,
  methods,
}: FormProps<T>): JSX.Element => {
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} id={id}>
        {children}
        <FormFooter
          submitLabel={submitLabel}
          accentColor={accentColor}
          formFooterBackLink={formFooterBackLink}
          optionalComponent={optionalFooterComponent}
        />
      </form>
    </FormProvider>
  );
};
