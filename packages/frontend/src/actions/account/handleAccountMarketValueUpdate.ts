'use server';

import {
  AccountDto,
  CreateTransactionCategoryMappingWithoutTransactionDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { DateService } from '$services/DateService';
import { ExpenseService } from '$ssr/api/ExpenseService';
import { IncomeService } from '$ssr/api/IncomeService';
import { UserDefaultMarketUpdateSettings } from '$ssr/api/UserPreferenceService';

export const handleAccountMarketValueUpdate: DefaultFormActionHandler<{
  account: AccountDto;
  marketSettings?: UserDefaultMarketUpdateSettings;
}> = async ({ account, marketSettings }, prevState, formData) => {
  const currentMarketValue = parseFloat(
    formData.get('currentMarketValue') as string,
  );

  const date = new DateService(formData.get('date') as string).getDate();

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
    date: date.toISO() as string,
    categories,
  };

  try {
    if (marketValueChangeAmount > 0) {
      await IncomeService.add({
        toAccount: account.id,
        ...transactionBaseFields,
      });
    } else {
      await ExpenseService.add({
        fromAccount: account.id,
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
