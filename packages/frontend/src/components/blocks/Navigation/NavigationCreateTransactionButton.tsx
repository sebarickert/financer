import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { FC } from 'react';

import {
  getAllAccounts,
  getAllCategoriesWithTree,
  getAllTransactionTemplates,
  getDefaultExpenseAccount,
  getDefaultIncomeAccount,
  getDefaultTransferSourceAccount,
  getDefaultTransferTargetAccount,
} from '@/api-service';
import { Drawer } from '@/blocks/Drawer';
import { Button } from '@/elements/Button/Button';
import { TransactionFormSwitcher } from '@/features/transaction/TransactionFormSwitcher';
interface CreateTransactionButtonProps {
  id?: string;
  isDisabled?: boolean;
}

const CreateTransactionButton: FC<CreateTransactionButtonProps> = ({
  id,
  isDisabled,
}) => {
  return (
    <Button
      accentColor="unstyled"
      haptic="heavy"
      type="button"
      aria-label="Add Transaction"
      className={clsx(
        'text-base rounded-md text-center',
        'items-center justify-center',
        'max-lg:flex max-lg:flex-col max-lg:h-full max-lg:!w-full max-lg:rounded-none',
        'lg:button-primary lg:text-sm lg:h-8 lg:px-3 lg:rounded-full lg:[&_svg]:size-5 lg:[&:has(svg)]:gap-1',
      )}
      popoverTarget={id}
      data-testid="add-transaction"
      isDisabled={isDisabled}
    >
      <Plus className="lg:hidden" />
      <Plus className="max-lg:hidden" />
      <span className="max-lg:hidden">Transaction</span>
    </Button>
  );
};

export const NavigationCreateTransactionButton: FC<{
  className?: string;
}> = async ({ className }) => {
  const id = 'navigationCreateTransactionButton';

  const defaultExpenseAccountId = await getDefaultExpenseAccount();
  const defaultIncomeAccountId = await getDefaultIncomeAccount();
  const defaultTransferToAccountId = await getDefaultTransferTargetAccount();
  const defaultTransferFromAccountId = await getDefaultTransferSourceAccount();

  const categories = await getAllCategoriesWithTree();
  const templates = await getAllTransactionTemplates();
  const accounts = await getAllAccounts();

  return (
    <li className={clsx(className)}>
      <Drawer heading="Add Transaction" id={id} testId="transaction-drawer">
        <TransactionFormSwitcher
          typeSwitcherName="transaction-type-switcher"
          templateSwitcherName="templateTypeSwitcher"
          defaultExpenseAccountId={defaultExpenseAccountId}
          defaultIncomeAccountId={defaultIncomeAccountId}
          defaultTransferToAccountId={defaultTransferToAccountId}
          defaultTransferFromAccountId={defaultTransferFromAccountId}
          transactionCategoriesWithCategoryTree={categories}
          transactionTemplates={templates}
          accounts={accounts}
        />
      </Drawer>
      <CreateTransactionButton id={id} />
    </li>
  );
};
