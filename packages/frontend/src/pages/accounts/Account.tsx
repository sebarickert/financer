import {
  CreateTransactionCategoryMappingDtoWithoutTransaction,
  SortOrder,
} from '@local/types';
import { Suspense, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../components/alert/alert';
import { DescriptionList } from '../../components/description-list/description-list';
import { DescriptionListItem } from '../../components/description-list/description-list.item';
import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LatestAccountTransactions } from '../../components/latest-transactions/latest-account-transactions';
import { LinkList } from '../../components/link-list/link-list';
import { LinkListLink } from '../../components/link-list/link-list.link';
import { LoaderSuspense } from '../../components/loader/loader-suspense';
import { initialMonthFilterOptions } from '../../components/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '../../components/pager/pager';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { monthNames } from '../../constants/months';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteAccount } from '../../hooks/account/useDeleteAccount';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { useUserDefaultMarketUpdateSettings } from '../../hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';
import { useTransactionsByAccountIdPaged } from '../../hooks/transaction/useTransactionsByAccountId';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';
import { capitalize } from '../../utils/capitalize';
import { formatCurrency } from '../../utils/formatCurrency';

import { AccountDeleteModal } from './account-modals/AccountDeleteModal';
import { AccountUpdateMarketValueModal } from './account-modals/AccountUpdateMarketValueModal';
import { AccountBalanceHistoryChart } from './AccountBalanceHistoryChart';

const AccountTransactionAmount = ({
  accountId,
}: {
  accountId: string;
}): JSX.Element => {
  const { data } = useTransactionsByAccountIdPaged(accountId);

  return <>{data.totalRowCount}</>;
};

export const Account = (): JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error('Account id is not defined');
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();
  const account = useAccountById(id);
  const [marketSettings] = useUserDefaultMarketUpdateSettings();

  const [errors, setErrors] = useState<string[]>([]);
  const addIncome = useAddIncome();
  const addExpense = useAddExpense();

  const [monthFilterOptions, setMonthFilterOptions] = useState(
    initialMonthFilterOptions
  );
  const {
    data: {
      data: [transaction],
    },
  } = useAllTransactionsPaged(1, {
    limit: 1,
    sortOrder: SortOrder.ASC,
  });

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
        console.error(error);
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
        console.error(error);
      }
    } else {
      console.log('Current value is same as previous no update needed.');
    }
  };

  const firstTransactionEverDate = new Date(transaction?.date || new Date());

  const pageVisibleYear = monthFilterOptions.year;
  const pageVisibleMonth = monthNames[monthFilterOptions.month - 1];

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

  return (
    <>
      <UpdatePageInfo title={`${account.name}`} backLink="/accounts" />
      {errors.length > 0 && (
        <Alert additionalInformation={errors} testId="account-page-errors">
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <section className={'mb-6 grid md:grid-cols-2 gap-6'}>
        <DescriptionList>
          <DescriptionListItem label="Balance" isLarge testId="account-balance">
            {formatCurrency(account.balance)}
          </DescriptionListItem>
          <DescriptionListItem label="Type" testId="account-type">
            {capitalize(account.type)}
          </DescriptionListItem>
          <DescriptionListItem label="Transactions">
            <Suspense fallback="-">
              <AccountTransactionAmount accountId={id} />
            </Suspense>
          </DescriptionListItem>
        </DescriptionList>
        <LinkList isVertical>
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
            icon={IconName.cog}
          >
            Edit account
          </LinkListLink>
          <AccountDeleteModal handleDelete={handleDelete} />
        </LinkList>
      </section>
      <LoaderSuspense>
        <AccountBalanceHistoryChart accountId={account._id} />
      </LoaderSuspense>
      <section className="flex items-center justify-between mb-4 mt-8">
        <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
        <Pager
          pagerOptions={{
            nextPage: {
              isAvailable: !(
                monthFilterOptions.month === initialMonthFilterOptions.month &&
                monthFilterOptions.year === initialMonthFilterOptions.year
              ),
              load: () => handleMonthOptionChange('next'),
            },
            previousPage: {
              isAvailable: !(
                monthFilterOptions.month ===
                  firstTransactionEverDate.getMonth() + 1 &&
                monthFilterOptions.year ===
                  firstTransactionEverDate.getFullYear()
              ),
              load: () => handleMonthOptionChange('previous'),
            },
          }}
        ></Pager>
      </section>
      <LoaderSuspense>
        <LatestAccountTransactions
          accountId={id}
          filterOptions={monthFilterOptions}
        />
      </LoaderSuspense>
    </>
  );
};
