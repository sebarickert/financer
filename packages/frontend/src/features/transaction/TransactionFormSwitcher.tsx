'use client';

import { FC, useMemo, useState } from 'react';

import { TransactionForm, TransactionFormFields } from './TransactionForm';
import { TransactionTemplateSwitcher } from './TransactionTemplateSwitcher';
import { TransactionTypeSwitcher } from './TransactionTypeSwitcher/TransactionTypeSwitcher';

import { handleTransactionCreate } from '@/actions/transaction/handleTransactionCreate';
import {
  SchemaAccountDto,
  SchemaTransactionTemplateDto,
  TransactionType,
} from '@/api/ssr-financer-api';
import { TransactionCategoryDtoWithCategoryTree } from '@/types/TransactionCategoryDtoWithCategoryTree';

const emptyFormValues = {
  amount: undefined,
  toAccount: undefined,
  fromAccount: undefined,
  description: '',
  categories: undefined,
};

interface TransactionFormSwitcherProps {
  typeSwitcherName?: string;
  templateSwitcherName?: string;
  defaultExpenseAccountId: string | undefined;
  defaultIncomeAccountId: string | undefined;
  defaultTransferToAccountId: string | undefined;
  defaultTransferFromAccountId: string | undefined;
  transactionCategoriesWithCategoryTree:
    | TransactionCategoryDtoWithCategoryTree[]
    | undefined;
  transactionTemplates: SchemaTransactionTemplateDto[] | undefined;
  accounts: SchemaAccountDto[];
}

const formPropsMapping = {
  [TransactionType.INCOME]: { hasToAccountField: true },
  [TransactionType.EXPENSE]: { hasFromAccountField: true },
  [TransactionType.TRANSFER]: {
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
  transactionCategoriesWithCategoryTree,
  transactionTemplates,
  accounts,
}) => {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.EXPENSE,
  );

  const [templateId, setTemplateId] = useState<string | undefined>();

  const selectedTemplate = useMemo(
    () => transactionTemplates?.find(({ id }) => id === templateId),
    [templateId, transactionTemplates],
  );

  const templateFormValues: Partial<TransactionFormFields> | undefined =
    useMemo(() => {
      if (!selectedTemplate) {
        switch (transactionType) {
          case TransactionType.INCOME:
            return {
              ...emptyFormValues,
              toAccount: defaultIncomeAccountId,
            };
          case TransactionType.EXPENSE:
            return {
              ...emptyFormValues,
              fromAccount: defaultExpenseAccountId,
            };
          case TransactionType.TRANSFER:
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
        amount: selectedTemplate.amount ?? undefined,
        toAccount: selectedTemplate.toAccount ?? undefined,
        fromAccount: selectedTemplate.fromAccount ?? undefined,
        description: selectedTemplate.description,
        categories: selectedTemplate.categories?.map((categoryId) => ({
          categoryId,
          amount: NaN,
        })),
      };
    }, [
      defaultExpenseAccountId,
      defaultIncomeAccountId,
      defaultTransferFromAccountId,
      defaultTransferToAccountId,
      selectedTemplate,
      transactionType,
    ]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType(event.target.value as TransactionType);
    setTemplateId(undefined);
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    setTemplateId(
      (
        event.target[
          templateSwitcherName ?? 'templateSwitcher'
        ] as HTMLFormElement
      )?.value as string | undefined,
    );
  };

  const filteredTransactionCategories =
    transactionCategoriesWithCategoryTree?.filter(({ visibility }) =>
      visibility.includes(transactionType),
    );

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] gap-3 mb-4">
        <TransactionTypeSwitcher
          onChange={handleTypeChange}
          defaultChecked={transactionType}
          name={typeSwitcherName}
        />
        <TransactionTemplateSwitcher
          transactionTemplates={transactionTemplates}
          selectedTemplateId={templateId}
          transactionType={transactionType}
          onChange={handleTemplateChange}
          name={templateSwitcherName}
        />
      </div>
      <TransactionForm
        onSubmit={handleTransactionCreate}
        initialValues={templateFormValues}
        transactionCategoriesWithCategoryTree={filteredTransactionCategories}
        accounts={accounts}
        {...formPropsMapping[transactionType]}
      />
    </div>
  );
};
