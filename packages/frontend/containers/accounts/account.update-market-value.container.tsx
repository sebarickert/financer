import { notFound } from 'next/navigation';
import { FC } from 'react';

import {
  AccountDto,
  CreateTransactionCategoryMappingWithoutTransactionDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { ExpenseService } from '$ssr/api/expense.service ';
import { IncomeService } from '$ssr/api/income.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { AccountUpdateMarketValue } from '$views/accounts/account.update-market-value';

interface AccountUpdateMarketValueContainerProps {
  account: AccountDto;
}

export const AccountUpdateMarketValueContainer: FC<
  AccountUpdateMarketValueContainerProps
> = async ({ account }) => {
  const marketSettings =
    await UserPreferenceService.getDefaultMarketUpdateSettings();

  const { id, balance } = account;

  if (!account || !id) {
    notFound();
  }

  const handleUpdate: DefaultFormActionHandler = async (prev, formData) => {
    'use server';

    const currentMarketValue = parseFloat(
      formData.get('currentMarketValue') as string,
    );
    const date = new Date(formData.get('date') as string);

    const transactionDescription =
      marketSettings?.transactionDescription ?? 'Market value change';
    const marketValueChangeAmount = currentMarketValue - account.balance;

    if (isNaN(marketValueChangeAmount) || marketValueChangeAmount === 0) {
      console.log('Current value is same as previous, no update needed.');

      return { status: 'OK' };
    }

    const categoryId = marketSettings?.category;

    const categories: CreateTransactionCategoryMappingWithoutTransactionDto[] =
      typeof categoryId === 'undefined'
        ? []
        : [
            {
              amount: Math.abs(marketValueChangeAmount),
              description: transactionDescription,
              categoryId,
            },
          ];

    const transactionBaseFields = {
      amount: Math.abs(marketValueChangeAmount),
      description: transactionDescription,
      date: date?.toISOString() ?? new Date().toISOString(),
      categories,
    };

    try {
      if (marketValueChangeAmount > 0) {
        await IncomeService.add({
          toAccount: id,
          ...transactionBaseFields,
        });
      } else {
        await ExpenseService.add({
          fromAccount: id,
          ...transactionBaseFields,
        });
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        return { status: 'ERROR', errors: error.errors };
      }

      console.error(error);
      return { status: 'ERROR', errors: ['Something went wrong'] };
    }

    return {
      status: 'OK',
    };
  };

  return (
    <AccountUpdateMarketValue currentValue={balance} onUpdate={handleUpdate} />
  );
};
