import clsx from 'clsx';
import { FC, useId } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { Icon } from '$elements/Icon';
import { TransactionFormSwitcher } from '$features/transaction/TransactionFormSwitcher';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

type NavigationCreateTransactionButtonProps = {
  className?: string;
};

export const NavigationCreateTransactionButton: FC<
  NavigationCreateTransactionButtonProps
> = async ({ className }) => {
  const id = useId();

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
          'items-center justify-center theme-focus theme-text-primary',
          'max-lg:flex max-lg:flex-col max-lg:h-full max-lg:!w-full',
          'lg:inline-flex lg:gap-2 lg:py-3 lg:px-4 lg:rounded-md lg:border lg:border-transparent',
          'lg:theme-button-primary',
        )}
        popoverTarget={id}
        data-testid="add-transaction"
      >
        <Icon name="PlusIcon" />
        <span className="sr-only">Add</span>
        <span className="max-lg:hidden">Transaction</span>
      </Button>
    </li>
  );
};
