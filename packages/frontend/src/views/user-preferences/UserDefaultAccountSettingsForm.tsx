'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { SchemaAccountDto } from '@/api/ssr-financer-api';
import { Form } from '@/blocks/Form';
import { TRANSACTION_TYPE_MAPPING } from '@/constants/transaction/TRANSACTION_TYPE_MAPPING';
import { Button } from '@/elements/Button/Button';
import { Select } from '@/elements/Select';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '@/hooks/useFinancerFormState';

export interface UserDefaultAccountSettingsFormFields {
  toAccountIncome: string;
  fromAccountExpense: string;
  fromAccountTransfer: string;
  toAccountTransfer: string;
}

interface UserDefaultAccountSettingsFormProps {
  accounts?: SchemaAccountDto[];
  defaultExpenseAccount?: string;
  defaultTransferSourceAccount?: string;
  defaultIncomeAccount?: string;
  defaultTransferTargetAccount?: string;
  onSave: DefaultFormActionHandler;
}

export const UserDefaultAccountSettingsForm: FC<
  UserDefaultAccountSettingsFormProps
> = ({
  accounts,
  defaultExpenseAccount,
  defaultTransferSourceAccount,
  defaultIncomeAccount,
  defaultTransferTargetAccount,
  onSave,
}) => {
  const action = useFinancerFormState('user-default-account-settings', onSave);
  const methods = useForm<UserDefaultAccountSettingsFormFields>();

  useEffect(() => {
    const firstAccountId = accounts?.at(0)?.id;

    methods.reset({
      fromAccountExpense: defaultExpenseAccount ?? firstAccountId,
      fromAccountTransfer: defaultTransferSourceAccount ?? firstAccountId,
      toAccountIncome: defaultIncomeAccount ?? firstAccountId,
      toAccountTransfer: defaultTransferTargetAccount ?? firstAccountId,
    });
  }, [
    accounts,
    defaultExpenseAccount,
    defaultIncomeAccount,
    defaultTransferSourceAccount,
    defaultTransferTargetAccount,
    methods,
  ]);

  return (
    <Form
      methods={methods}
      action={action}
      testId="default-account-settings-form"
    >
      <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
        <Select
          id="toAccountIncome"
          options={
            accounts?.map(({ name, id }) => ({
              label: name,
              value: id,
            })) ?? []
          }
          isRequired
          Icon={TRANSACTION_TYPE_MAPPING.INCOME.Icon}
        >
          Default income account
        </Select>
        <Select
          id="fromAccountExpense"
          options={
            accounts?.map(({ name, id }) => ({
              label: name,
              value: id,
            })) ?? []
          }
          isRequired
          Icon={TRANSACTION_TYPE_MAPPING.EXPENSE.Icon}
        >
          Default expense account
        </Select>
        <Select
          id="fromAccountTransfer"
          options={
            accounts?.map(({ name, id }) => ({
              label: name,
              value: id,
            })) ?? []
          }
          isRequired
          Icon={TRANSACTION_TYPE_MAPPING.EXPENSE.Icon}
        >
          Default transfer source account
        </Select>
        <Select
          id="toAccountTransfer"
          options={
            accounts?.map(({ name, id }) => ({
              label: name,
              value: id,
            })) ?? []
          }
          isRequired
          Icon={TRANSACTION_TYPE_MAPPING.INCOME.Icon}
        >
          Default transfer target account
        </Select>
      </div>
      <Form.Footer>
        <Button type="submit">Save</Button>
      </Form.Footer>
    </Form>
  );
};
