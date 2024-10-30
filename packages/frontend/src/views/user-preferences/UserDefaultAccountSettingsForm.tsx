'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AccountDto } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { Select } from '$elements/select/select';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';

export type UserDefaultAccountSettingsFormFields = {
  toAccountIncome: string;
  fromAccountExpense: string;
  fromAccountTransfer: string;
  toAccountTransfer: string;
};

type UserDefaultAccountSettingsFormProps = {
  accounts?: AccountDto[];
  defaultExpenseAccount?: string;
  defaultTransferSourceAccount?: string;
  defaultIncomeAccount?: string;
  defaultTransferTargetAccount?: string;
  onSave: DefaultFormActionHandler;
};

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
      fromAccountExpense: defaultExpenseAccount || firstAccountId,
      fromAccountTransfer: defaultTransferSourceAccount || firstAccountId,
      toAccountIncome: defaultIncomeAccount || firstAccountId,
      toAccountTransfer: defaultTransferTargetAccount || firstAccountId,
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
      submitLabel="Save"
      formFooterBackLink={settingsPaths.userPreferences}
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
        >
          Default transfer target account
        </Select>
      </div>
    </Form>
  );
};
