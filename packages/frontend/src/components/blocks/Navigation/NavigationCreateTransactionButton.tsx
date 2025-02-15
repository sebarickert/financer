import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { FC, Suspense } from 'react';

import { Drawer } from '$blocks/Drawer';
import { Button } from '$elements/Button/Button';
import { TransactionFormSwitcher } from '$features/transaction/TransactionFormSwitcher';
import { CategoryService } from '$ssr/api/CategoryService';
import { TransactionTemplateService } from '$ssr/api/TransactionTemplateService';
import { UserPreferenceService } from '$ssr/api/UserPreferenceService';

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
        'lg:button-primary lg:py-3 lg:h-12 lg:px-[18px] lg:text-base',
      )}
      popoverTarget={id}
      data-testid="add-transaction"
      isDisabled={isDisabled}
    >
      <Plus />
      <span className="max-lg:hidden">
        <span className="sr-only">Add</span> Transaction
      </span>
    </Button>
  );
};

interface NavigationCreateTransactionButtonSuspenseProps {
  className?: string;
  isLoading?: boolean;
}

export const NavigationCreateTransactionButtonSuspense: FC<
  NavigationCreateTransactionButtonSuspenseProps
> = ({ isLoading, className }) => {
  if (isLoading) {
    return <CreateTransactionButton isDisabled />;
  }

  return (
    <Suspense fallback={<CreateTransactionButton isDisabled />}>
      <NavigationCreateTransactionButton className={className} />
    </Suspense>
  );
};

interface NavigationCreateTransactionButtonProps {
  className?: string;
}

const NavigationCreateTransactionButton: FC<
  NavigationCreateTransactionButtonProps
> = async ({ className }) => {
  const id = 'navigationCreateTransactionButton';

  const defaultExpenseAccountId =
    await UserPreferenceService.getDefaultExpenseAccount();
  const defaultIncomeAccountId =
    await UserPreferenceService.getDefaultIncomeAccount();
  const defaultTransferToAccountId =
    await UserPreferenceService.getDefaultTransferTargetAccount();
  const defaultTransferFromAccountId =
    await UserPreferenceService.getDefaultTransferSourceAccount();

  const categories = await CategoryService.getAllWithTree();
  const templates = await TransactionTemplateService.getAll();

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
        />
      </Drawer>
      <CreateTransactionButton id={id} />
    </li>
  );
};
