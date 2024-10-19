import { FC, useState } from 'react';

import { TransactionForm } from './transaction-form/transaction-form';
import { TransactionTemplateSwitcher } from './TransactionTemplateSwitcher';
import { TransactionTypeSwitcher } from './TransactionTypeSwitcher/TransactionTypeSwitcher';

import { TransactionType } from '$api/generated/financerApi';
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

  const formPropsMapping = {
    [TransactionType.Income]: { hasToAccountField: true },
    [TransactionType.Expense]: { hasFromAccountField: true },
    [TransactionType.Transfer]: {
      hasToAccountField: true,
      hasFromAccountField: true,
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType?.(event.target.value as TransactionType);
  };

  return (
    <section>
      <div className="grid gap-4 mb-6">
        <TransactionTypeSwitcher
          onChange={handleChange}
          defaultChecked={transactionType}
        />
        <TransactionTemplateSwitcher
          // selectedTemplate={templateId}
          templateType={transactionType}
        />
      </div>
      <TransactionForm
        onSubmit={onSubmit}
        {...formPropsMapping[transactionType]}
      />
    </section>
  );
};
