'use client';

import { FC, useMemo, useState } from 'react';

import { TransactionForm, TransactionFormFields } from './TransactionForm';
import { TransactionTemplateSwitcher } from './TransactionTemplateSwitcher';
import { TransactionTypeSwitcher } from './TransactionTypeSwitcher/TransactionTypeSwitcher';

import {
  TransactionType,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { createTransaction } from '$ssr/createTransaction';

const emptyFormValues = {
  amount: null as never,
  toAccount: undefined,
  fromAccount: undefined,
  description: '',
  categories: undefined,
};

type TransactionFormSwitcherProps = {
  typeSwitcherName?: string;
  templateSwitcherName?: string;

  defaultExpenseAccountId: string | undefined;
  defaultIncomeAccountId: string | undefined;
  defaultTransferToAccountId: string | undefined;
  defaultTransferFromAccountId: string | undefined;
};

const formPropsMapping = {
  [TransactionType.Income]: { hasToAccountField: true },
  [TransactionType.Expense]: { hasFromAccountField: true },
  [TransactionType.Transfer]: {
    hasToAccountField: true,
    hasFromAccountField: true,
  },
};

export const TransactionFormSwitcher: FC<TransactionFormSwitcherProps> = ({
  typeSwitcherName,
  templateSwitcherName,
  defaultExpenseAccountId,
  defaultIncomeAccountId,
  defaultTransferToAccountId,
  defaultTransferFromAccountId,
}) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.Expense,
  );

  const [templateId, setTemplateId] = useState<string | undefined>();

  const { currentData } = useTransactionTemplatesFindOneQuery(
    {
      id: templateId ?? '',
    },
    { skip: !templateId },
  );

  const templateFormValues: Partial<TransactionFormFields> | undefined =
    useMemo(() => {
      if (!currentData) {
        switch (transactionType) {
          case TransactionType.Income:
            return {
              ...emptyFormValues,
              toAccount: defaultIncomeAccountId,
            };
          case TransactionType.Expense:
            return {
              ...emptyFormValues,
              fromAccount: defaultExpenseAccountId,
            };
          case TransactionType.Transfer:
            return {
              ...emptyFormValues,
              toAccount: defaultTransferToAccountId,
              fromAccount: defaultTransferFromAccountId,
            };
          default:
            return emptyFormValues;
        }
      }

      return {
        amount: currentData?.amount,
        toAccount: currentData?.toAccount ?? undefined,
        fromAccount: currentData?.fromAccount ?? undefined,
        description: currentData?.description,
        categories: currentData?.categories?.map((categoryId) => ({
          categoryId,
          amount: NaN,
        })),
      };
    }, [
      currentData,
      defaultExpenseAccountId,
      defaultIncomeAccountId,
      defaultTransferFromAccountId,
      defaultTransferToAccountId,
      transactionType,
    ]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType(event.target.value as TransactionType);
    setTemplateId(undefined);
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    setTemplateId(
      event.target[templateSwitcherName ?? 'templateSwitcher'].value,
    );
  };

  return (
    <div>
      <div className="grid grid-cols-[1fr,auto] gap-4 mb-4">
        <TransactionTypeSwitcher
          onChange={handleTypeChange}
          defaultChecked={transactionType}
          name={typeSwitcherName}
        />
        <TransactionTemplateSwitcher
          selectedTemplate={templateId}
          templateType={transactionType}
          onChange={handleTemplateChange}
          name={templateSwitcherName}
        />
      </div>
      <TransactionForm
        onSubmit={createTransaction}
        initialValues={templateFormValues}
        {...formPropsMapping[transactionType]}
      />
    </div>
  );
};
