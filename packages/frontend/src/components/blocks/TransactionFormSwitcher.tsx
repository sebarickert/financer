import { FC, useEffect, useState } from 'react';

import { TransactionForm, TransactionFormFields } from './TransactionForm';
import { TransactionTemplateSwitcher } from './TransactionTemplateSwitcher';
import { TransactionTypeSwitcher } from './TransactionTypeSwitcher/TransactionTypeSwitcher';

import {
  TransactionType,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';

type TransactionFormSwitcherProps = {
  onSubmit: DefaultFormActionHandler;
};

export const TransactionFormSwitcher: FC<TransactionFormSwitcherProps> = ({
  onSubmit,
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

  const [templateFormValues, setTemplateFormValues] = useState<
    Partial<TransactionFormFields> | undefined
  >(undefined);

  useEffect(() => {
    if (!templateId || !currentData)
      return setTemplateFormValues({
        // Switching from template to empty doesn't reset the form
        amount: undefined,
        toAccount: undefined,
        fromAccount: undefined,
        description: '',
        categories: undefined,
      });

    const values = {
      amount: currentData?.amount,
      toAccount: currentData?.toAccount ?? undefined,
      fromAccount: currentData?.fromAccount ?? undefined,
      description: currentData?.description,
      categories: currentData?.categories?.map((categoryId) => ({
        categoryId,
        amount: NaN,
      })),
    };

    setTemplateFormValues(values);
  }, [currentData, templateId]);

  const formPropsMapping = {
    [TransactionType.Income]: { hasToAccountField: true },
    [TransactionType.Expense]: { hasFromAccountField: true },
    [TransactionType.Transfer]: {
      hasToAccountField: true,
      hasFromAccountField: true,
    },
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType(event.target.value as TransactionType);
    setTemplateId(undefined);
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    setTemplateId(event.target.templateSwitcher.value);
  };

  return (
    <section>
      <div className="grid gap-3 mb-6">
        <TransactionTypeSwitcher
          onChange={handleTypeChange}
          defaultChecked={transactionType}
        />
        <TransactionTemplateSwitcher
          selectedTemplate={templateId}
          templateType={transactionType}
          onChange={handleTemplateChange}
        />
      </div>
      <TransactionForm
        onSubmit={onSubmit}
        initialValues={templateFormValues}
        {...formPropsMapping[transactionType]}
      />
    </section>
  );
};
