import { CreateTransactionCategoryMappingDtoWithoutTransaction } from '@local/types';
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
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteAccount } from '../../hooks/account/useDeleteAccount';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { useUserDefaultMarketUpdateSettings } from '../../hooks/profile/user-preference/useDefaultMarketUpdateSettings';
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
          <DescriptionListItem label="Balance" isLarge>
            {formatCurrency(account.balance)}
          </DescriptionListItem>
          <DescriptionListItem label="Type">
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
      <AccountBalanceHistoryChart accountId={account._id} />
      <section className="my-6">
        <Heading>History</Heading>
        <LoaderSuspense>
          <LatestAccountTransactions accountId={id} />
        </LoaderSuspense>
      </section>
    </>
  );
};
