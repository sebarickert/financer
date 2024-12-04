import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { FC } from 'react';

import { Drawer } from '$blocks/Drawer';
import { Button } from '$elements/Button/Button';
import { TransactionFormSwitcher } from '$features/transaction/TransactionFormSwitcher';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

type NavigationCreateTransactionButtonProps = {
  className?: string;
};

export const NavigationCreateTransactionButton: FC<
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
        />
      </Drawer>
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
      >
        <Plus />
        <span className="max-lg:hidden">
          <span className="sr-only">Add</span> Transaction
        </span>
      </Button>
    </li>
  );
};
