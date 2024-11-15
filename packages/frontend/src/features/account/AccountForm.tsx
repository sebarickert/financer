'use client';

import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { AccountType } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { Input } from '$elements/input/input';
import { Select, Option } from '$elements/Select';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { capitalize } from '$utils/capitalize';

type AccountFormProps = {
  onSubmit: DefaultFormActionHandler;
  submitLabel: string;
  initialValues?: Partial<AccountFormFields>;
};

export type AccountFormFields = {
  name: string;
  balance: number;
  type: AccountType;
};

export const AccountForm: FC<AccountFormProps> = ({
  onSubmit,
  submitLabel,
  initialValues,
}: AccountFormProps) => {
  const action = useFinancerFormState('account-form', onSubmit);

  const defaultValues = useMemo(() => {
    return { type: AccountType.Savings, ...initialValues };
  }, [initialValues]);

  const methods = useForm<AccountFormFields>({
    defaultValues,
  });

  const { reset } = methods;

  const accountTypes: Option[] = Object.values(AccountType).map((value) => ({
    value,
    label: capitalize(value.replaceAll('_', ' ').toLowerCase()),
  }));

  useEffect(() => {
    if (!initialValues) return;

    reset((previousValues) => ({
      ...previousValues,
      ...defaultValues,
    }));
  }, [defaultValues, initialValues, reset]);

  return (
    <Form
      methods={methods}
      submitLabel={submitLabel}
      action={action}
      formFooterBackLink="/accounts"
      testId="account-form"
    >
      <section>
        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
          <Input id="name" isRequired>
            Account
          </Input>
          <Input id="balance" type="number" step={0.01} isRequired>
            Balance
          </Input>
          <Select id="type" options={accountTypes} isRequired>
            Type
          </Select>
        </div>
      </section>
    </Form>
  );
};
