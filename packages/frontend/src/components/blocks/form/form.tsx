import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

import { FormFooter } from './form.footer';

import { ButtonAccentColor } from '$elements/button/button';

type FormProps<FormValues extends FieldValues> = {
  children: React.ReactNode;
  submitLabel: string;
  accentColor?: ButtonAccentColor;
  formFooterBackLink?: string;
  methods: UseFormReturn<FormValues>;
  id?: string;
  optionalFooterComponent?: React.ReactNode;
} & (
  | {
      onSubmit: SubmitHandler<FormValues>;
      action?: never;
    }
  | {
      onSubmit?: never;
      action: (values: FormData) => void;
    }
);

export const Form = <T extends FieldValues>({
  children,
  submitLabel,
  onSubmit,
  accentColor = 'black',
  formFooterBackLink,
  optionalFooterComponent,
  id,
  methods,
  action,
}: FormProps<T>): JSX.Element => {
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        action={action}
        onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
        id={id}
      >
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
