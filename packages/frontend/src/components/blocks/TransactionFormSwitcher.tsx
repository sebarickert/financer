import { FC, useState } from 'react';

import { TransactionForm } from './transaction-form/transaction-form';
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

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type);
  };

  return (
    <section>
      <TransactionTypeSwitcher
        onTransactionTypeChange={handleTransactionTypeChange}
      />
      <TransactionForm
        onSubmit={onSubmit}
        {...formPropsMapping[transactionType]}
      />
    </section>
  );
};
