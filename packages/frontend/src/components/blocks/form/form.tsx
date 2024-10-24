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
  testId?: string;
  optionalFooterComponent?: React.ReactNode;
  hasCancelButton?: boolean;
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
  accentColor,
  formFooterBackLink,
  optionalFooterComponent,
  testId,
  methods,
  action,
  hasCancelButton,
}: FormProps<T>): JSX.Element => {
  const { handleSubmit } = methods;

  return (
    <>
      <FormProvider {...methods}>
        <form
          action={action}
          onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
          data-testid={testId}
        >
          {children}
          <FormFooter
            submitLabel={submitLabel}
            accentColor={accentColor}
            formFooterBackLink={formFooterBackLink}
            optionalComponent={optionalFooterComponent}
            hasCancelButton={hasCancelButton}
          />
        </form>
      </FormProvider>
    </>
  );
};
