import { CreateTransactionCategoryMappingDtoWithoutTransaction } from '@local/types';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../components/alert/alert';
import { Heading } from '../../components/heading/heading';
import { LinkList } from '../../components/link-list/link-list';
import { LinkListLink } from '../../components/link-list/link-list.link';
import { Loader } from '../../components/loader/loader';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { ITransactionStackedListRowProps as TransactionStackedListRowProps } from '../../components/transaction-stacked-list/transaction-stacked-list.row';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteAccount } from '../../hooks/account/useDeleteAccount';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { useUserDefaultMarketUpdateSettings } from '../../hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useTransactionsByAccountId } from '../../hooks/transaction/useTransactionsByAccountId';
import { useAllTransactionCategories } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../../hooks/transactionCategoryMapping/useAllTransactionCategoryMappings';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';
import { capitalize } from '../../utils/capitalize';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import {
  getTransactionType,
  mapTransactionTypeToUrlPrefix,
} from '../statistics/Statistics';

import { AccountDeleteModal } from './account-modals/AccountDeleteModal';
import { AccountUpdateMarketValueModal } from './account-modals/AccountUpdateMarketValueModal';
import { AccountBalanceHistoryChart } from './AccountBalanceHistoryChart';

export const Account = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();
  const [{ data: account, isLoading: isLoadingAccount }] = useAccountById(id);
  const [transactions, setTransactions] = useState<
    TransactionStackedListRowProps[]
  >([]);
  const [rawTransactions] = useTransactionsByAccountId(id);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();
  const [marketSettings] = useUserDefaultMarketUpdateSettings();

  const [errors, setErrors] = useState<string[]>([]);
  const addIncome = useAddIncome();
  const addExpense = useAddExpense();

  useEffect(() => {
    if (!rawTransactions) return;

    setTransactions(
      rawTransactions.map(
        ({
          date: dateRaw,
          fromAccount,
          toAccount,
          description = 'Unknown',
          amount,
          _id,
        }): TransactionStackedListRowProps => {
          const date = new Date(dateRaw);
          const transactionType = getTransactionType(toAccount, fromAccount);

          const categoryMappings = transactionCategoryMappings
            ?.filter(({ transaction_id }) => transaction_id === _id)
            .map(
              ({ category_id }) =>
                transactionCategories.find(
                  ({ _id: categoryId }) => category_id === categoryId
                )?.name
            )
            .filter((categoryName) => typeof categoryName !== 'undefined');

          return {
            transactionCategories: categoryMappings.join(', '),
            transactionAmount: formatCurrency(amount),
            date: formatDate(date),
            label: description,
            link: `/statistics/${mapTransactionTypeToUrlPrefix[transactionType]}/${_id}`,
            transactionType,
            id: _id,
          } as TransactionStackedListRowProps;
        }
      )
    );
  }, [id, rawTransactions, transactionCategories, transactionCategoryMappings]);

  const handleDelete = async () => {
    if (!id) {
      console.error('Failure to delete account: no id');
      return;
    }
    await deleteAccount(id);
    navigate('/accounts');
  };

  const handleMarketValueUpdate = async (
    newMarketValue: number,
    date: Date
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

    const transactionDescription =
      marketSettings?.transactionDescription ?? 'Market value change';
    const marketValueChangeAmount = newMarketValue - account.balance;

    const mappedCategory: CreateTransactionCategoryMappingDtoWithoutTransaction =
      {
        amount: Math.abs(marketValueChangeAmount),
        description: transactionDescription,
        category_id:
          marketSettings?.category !== undefined ? marketSettings.category : '',
      };

    if (marketValueChangeAmount > 0) {
      try {
        const newIncomeJson = await addIncome({
          toAccount: id,
          amount: marketValueChangeAmount,
          description: transactionDescription,
          date: date ?? new Date(),
          categories: marketSettings?.category ? [mappedCategory] : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        if ('message' in newIncomeJson) {
          setErrors(parseErrorMessagesToArray(newIncomeJson.message));
          return;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    } else if (marketValueChangeAmount < 0) {
      try {
        const newExpenseJson = await addExpense({
          fromAccount: id,
          amount: Math.abs(marketValueChangeAmount),
          description: transactionDescription,
          date: new Date(),
          categories: marketSettings?.category ? [mappedCategory] : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        if ('message' in newExpenseJson) {
          setErrors(parseErrorMessagesToArray(newExpenseJson.message));
          return;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    } else {
      console.log('Current value is same as previous no update needed.');
    }
  };

  return isLoadingAccount || !account || !transactions || !id ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <UpdatePageInfo title={`${account.name}`} backLink="/accounts" />
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="account-page-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <section className={`bg-gray-25 border rounded-lg mb-6`}>
        <dl className="relative px-6 pt-10 pb-6 border-b">
          <dt className="absolute text-sm font-medium text-gray-700 truncate lg:text-base top-4 left-6">
            Balance
          </dt>
          <dd
            className="text-3xl font-bold tracking-tight"
            data-testid="account-balance"
          >
            {formatCurrency(account.balance)}
          </dd>
        </dl>
        <section className="grid grid-cols-2 divide-x">
          <dl className="py-4 pl-6 pr-4">
            <dt className="text-xs font-medium text-gray-700 truncate lg:text-sm">
              Type
            </dt>
            <dd
              className="text-xl font-bold tracking-tight"
              data-testid="account-type"
            >
              {capitalize(account.type)}
            </dd>
          </dl>
          <dl className="py-4 pl-6 pr-4">
            <dt className="text-xs font-medium text-gray-700 truncate lg:text-sm">
              Transactions
            </dt>
            <dd className="text-xl font-bold tracking-tight">
              {transactions.length}
            </dd>
          </dl>
        </section>
      </section>
      <AccountBalanceHistoryChart accountId={id} />
      <section className="my-6">
        <Heading>History</Heading>
        <TransactionStackedList className="mt-4" rows={transactions} />
      </section>
      <LinkList label="Actions">
        {account.type === 'investment' && (
          <AccountUpdateMarketValueModal
            currentValue={account.balance}
            handleUpdate={(newMarketValue, newDate) =>
              handleMarketValueUpdate(newMarketValue, newDate)
            }
          />
        )}
        <LinkListLink
          link={`/accounts/${id}/edit`}
          testId="edit-account"
          icon="cog"
        >
          Edit account
        </LinkListLink>
        <AccountDeleteModal handleDelete={handleDelete} />
      </LinkList>
    </>
  );
};
