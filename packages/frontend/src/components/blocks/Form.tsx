'use client';

import clsx from 'clsx';
import { useFormStatus } from 'react-dom';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

import { Loader } from '$elements/Loader';

type FormProps<FormValues extends FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<FormValues>;
  testId?: string;
  className?: string;
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
  onSubmit,
  testId,
  methods,
  action,
  className,
}: FormProps<T>): JSX.Element => {
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        action={action}
        onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
        data-testid={testId}
        className={clsx(className)}
      >
        {children}
      </form>
    </FormProvider>
  );
};

const FormFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { pending } = useFormStatus();

  return (
    <div className={clsx(className, 'flex items-center gap-8 mt-12')}>
      {children}
      {pending && <Loader.Icon />}
    </div>
  );
};

Form.Footer = FormFooter;
