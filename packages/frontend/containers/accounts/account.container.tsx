import { CreateTransactionCategoryMappingDtoWithoutTransaction } from '@local/types';
import { useState } from 'react';

import {
  useAccountsFindOneByIdQuery,
  useAccountsRemoveMutation,
  useIncomesCreateMutation,
  useExpensesCreateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { useUserDefaultMarketUpdateSettings } from '$hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { Account } from '$pages/accounts/account';
import { AccountUpdateMarketValueModalFormFields } from '$pages/accounts/account-modals/account-update-market-value.modal';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface AccountContainerProps {
  id: string;
}

export const AccountContainer = ({ id }: AccountContainerProps) => {
  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;

  const { push } = useViewTransitionRouter();
  const [deleteAccount, { isLoading: isLoadingAccount }] =
    useAccountsRemoveMutation();
  const { data: marketSettings, isLoading: isLoadingMarketSettings } =
    useUserDefaultMarketUpdateSettings();

  const [errors, setErrors] = useState<string[]>([]);
  const [addIncome, { isLoading: isCreatingIncome }] =
    useIncomesCreateMutation();
  const [addExpense, { isLoading: isCreatingExpense }] =
    useExpensesCreateMutation();

  const [monthFilterOptions, setMonthFilterOptions] = useState(
    initialMonthFilterOptions
  );
  const { data: transaction } = useFirstTransaction();

  const handleDelete = async () => {
    if (!id) {
      console.error('Failure to delete account: no id');
      return;
    }
    await deleteAccount({ id }).unwrap();
    push('/accounts');
  };

  const handleMarketValueUpdate =
    (closeDialog: () => void) =>
    async (
      newAccountUpdateMarketValueData: AccountUpdateMarketValueModalFormFields
    ) => {
      if (!id) {
        console.error('Failure to update market value: no id');
        return;
      }

      if (!account) {
        console.error(
          'Failure to update market value: no account data available'
        );
        return;
      }

      const { currentMarketValue, date } = newAccountUpdateMarketValueData;

      const transactionDescription =
        marketSettings?.transactionDescription ?? 'Market value change';
      const marketValueChangeAmount = currentMarketValue - account.balance;

      const mappedCategory: CreateTransactionCategoryMappingDtoWithoutTransaction =
        {
          amount: Math.abs(marketValueChangeAmount),
          description: transactionDescription,
          category_id:
            marketSettings?.category !== undefined
              ? marketSettings.category
              : '',
        };

      if (marketValueChangeAmount > 0) {
        try {
          const newIncomeJson = await addIncome({
            createIncomeDto: {
              toAccount: id,
              amount: marketValueChangeAmount,
              description: transactionDescription,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              date: (date ?? new Date()) as any,
              categories: (marketSettings?.category
                ? [mappedCategory]
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  undefined) as any,
            },
          }).unwrap();

          if ('message' in newIncomeJson) {
            setErrors(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              parseErrorMessagesToArray((newIncomeJson as any).message)
            );
            return;
          }
        } catch (transactionError) {
          // eslint-disable-next-line no-console
          console.error(transactionError);
        }
      } else if (marketValueChangeAmount < 0) {
        try {
          const newExpenseJson = await addExpense({
            createExpenseDto: {
              fromAccount: id,
              amount: Math.abs(marketValueChangeAmount),
              description: transactionDescription,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              date: (date ?? new Date()) as any,
              categories: (marketSettings?.category
                ? [mappedCategory]
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  undefined) as any,
            },
          }).unwrap();

          if ('message' in newExpenseJson) {
            setErrors(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              parseErrorMessagesToArray((newExpenseJson as any).message)
            );
            return;
          }
        } catch (transactionError) {
          // eslint-disable-next-line no-console
          console.error(transactionError);
        }
      } else {
        console.log('Current value is same as previous no update needed.');
        closeDialog();
      }
    };

  const handleMonthOptionChange = (direction: 'next' | 'previous') => {
    const { month, year } = monthFilterOptions;
    const monthWithTwoDigits = month.toString().padStart(2, '0');
    const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

    selectedMonth.setMonth(
      selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
    );

    setMonthFilterOptions({
      month: selectedMonth.getMonth() + 1,
      year: selectedMonth.getFullYear(),
    });
  };

  const firstAvailableTransaction = new Date(transaction?.date || new Date());

  const isLoading =
    isLoadingAccount ||
    isLoadingMarketSettings ||
    isCreatingIncome ||
    isCreatingExpense;

  return (
    <>
      <DataHandler {...data} />
      {account && (
        <Account
          isLoading={isLoading}
          account={account}
          filterOptions={monthFilterOptions}
          firstAvailableTransaction={firstAvailableTransaction}
          errors={errors}
          onMonthOptionChange={handleMonthOptionChange}
          onMarketValueUpdate={handleMarketValueUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};
