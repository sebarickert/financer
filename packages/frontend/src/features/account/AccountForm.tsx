'use client';

import clsx from 'clsx';
import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { AccountTypeRadio } from './AccountTypeRadio';

import { AccountType } from '$api/generated/financerApi';
import { Form } from '$blocks/Form';
import { Button } from '$elements/Button/Button';
import { Input } from '$elements/Input';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';

interface AccountFormProps {
  onSubmit: DefaultFormActionHandler;
  submitLabel: string;
  initialValues?: Partial<AccountFormFields>;
}

export interface AccountFormFields {
  name: string;
  balance: number;
  type: AccountType;
}

export const AccountForm: FC<AccountFormProps> = ({
  onSubmit,
  submitLabel,
  initialValues,
}: AccountFormProps) => {
  const action = useFinancerFormState('account-form', onSubmit);

  const defaultValues = useMemo(() => {
    return { ...initialValues };
  }, [initialValues]);

  const methods = useForm<AccountFormFields>({
    defaultValues,
  });

  const { reset } = methods;

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
      action={action}
      testId="account-form"
      className="@container/account-form"
    >
      <div className="grid gap-6">
        <Input id="name" isRequired>
          Name
        </Input>
        <Input id="balance" type="number" step={0.01} isRequired>
          Balance
        </Input>
        <fieldset>
          <legend className="mb-2">Type</legend>
          <div
            className={clsx(
              'grid gap-2',
              '@[700px]/account-form:grid-cols-2 @[700px]/account-form:[&>label]:min-h-[102px]',
              '@[1050px]/account-form:grid-cols-3',
            )}
          >
            {Object.values(AccountType).map((type) => (
              <AccountTypeRadio key={type} id="type" value={type} />
            ))}
          </div>
        </fieldset>
      </div>
      <Form.Footer>
        <Button type="submit">{submitLabel}</Button>
      </Form.Footer>
    </Form>
  );
};
