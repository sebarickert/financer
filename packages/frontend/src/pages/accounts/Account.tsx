import { CreateTransactionCategoryMappingDtoWithoutTransaction } from '@local/types';
import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AccountDeleteModal } from './account-modals/AccountDeleteModal';
import {
  AccountUpdateMarketValueModal,
  AccountUpdateMarketValueModalFormFields,
} from './account-modals/AccountUpdateMarketValueModal';
import { AccountBalanceHistoryChart } from './AccountBalanceHistoryChart';

import {
  useAccountsFindOneByIdQuery,
  useAccountsRemoveMutation,
  useExpensesCreateMutation,
  useIncomesCreateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { LatestAccountTransactions } from '$blocks/latest-account-transactions/latest-account-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { Alert } from '$elements/alert/alert';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
import { InfoCard } from '$elements/info-card/info-card';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { useUserDefaultMarketUpdateSettings } from '$hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';

export const Account = (): JSX.Element | null => {
  const { id } = useParams<{ id: string }>();

  if (!id) throw new Error('Account id is not defined');

  const data = useAccountsFindOneByIdQuery({ id });
  const account = data.data;

  const navigate = useNavigate();
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
    navigate('/accounts');
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

  const isLoading =
    isLoadingAccount ||
    isLoadingMarketSettings ||
    isCreatingIncome ||
    isCreatingExpense;
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <DataHandler {...data} />
      {!!account && (
        <>
          <UpdatePageInfo title={`${account.name}`} backLink="/accounts" />
          {errors.length > 0 && (
            <Alert additionalInformation={errors} testId="account-page-errors">
              There were {errors.length} errors with your submission
            </Alert>
          )}
          <section className={'mb-6 grid md:grid-cols-2 gap-4 md:gap-6'}>
            <section className={clsx('grid gap-2')}>
              <InfoCard label="Balance" testId="account-balance" isLarge>
                {formatCurrency(account.balance)}
              </InfoCard>
              <InfoCard label="Type" testId="account-type" isSmall>
                {capitalize(account.type)}
              </InfoCard>
            </section>
            <LinkList isVertical>
              {account.type === 'investment' && (
                <AccountUpdateMarketValueModal
                  currentValue={account.balance}
                  onUpdate={handleMarketValueUpdate}
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
          <section className="flex items-center justify-between mt-8 mb-2">
            <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
            <Pager
              pagerOptions={{
                nextPage: {
                  isAvailable: !(
                    monthFilterOptions.month ===
                      initialMonthFilterOptions.month &&
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
            />
          </section>
          <LoaderSuspense>
            <LatestAccountTransactions
              accountId={id}
              filterOptions={monthFilterOptions}
            />
          </LoaderSuspense>
        </>
      )}
    </>
  );
};
