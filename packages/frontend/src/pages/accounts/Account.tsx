import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { Heading } from '../../components/heading/heading';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { SEO } from '../../components/seo/seo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { ITransactionStackedListRowProps } from '../../components/transaction-stacked-list/transaction-stacked-list.row';
import { useAccountById } from '../../hooks/account/useAccountById';
import { useDeleteAccount } from '../../hooks/account/useDeleteAccount';
import { useTransactionsByAccountId } from '../../hooks/transaction/useTransactionsByAccountId';
import { useAllTransactionCategories } from '../../hooks/transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../../hooks/transactionCategoryMapping/useAllTransactionCategoryMappings';
import { capitalize } from '../../utils/capitalize';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import {
  getTransactionType,
  mapTransactionTypeToUrlPrefix,
} from '../statistics/Statistics';

import { AccountBalanceHistoryChart } from './AccountBalanceHistoryChart';

interface IAccountDeleteModalProps {
  handleDelete(): void;
}

const AccountDeleteModal = ({ handleDelete }: IAccountDeleteModalProps) => (
  <ModalConfirm
    label="Delete account"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete account"
    accentColor="red"
  >
    Are you sure you want to delete your account? All of your data will be
    permanently removed. This action cannot be undone.
  </ModalConfirm>
);

export const Account = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();
  const [account] = useAccountById(id);
  const [transactions, setTransactions] = useState<
    ITransactionStackedListRowProps[]
  >([]);
  const [rawTransactions] = useTransactionsByAccountId(id);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();

  useEffect(() => {
    if (!rawTransactions) return;
    setTransactions(
      rawTransactions
        .map(
          ({
            date: dateRaw,
            fromAccount,
            toAccount,
            description = 'Unknown',
            amount,
            _id,
          }): ITransactionStackedListRowProps => {
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
            } as ITransactionStackedListRowProps;
          }
        )
        .sort((a, b) =>
          new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1
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

  return !account || !transactions ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${account.name}`} />
      <Banner
        title={account.name}
        headindType="h1"
        testId="account-banner"
        className="mb-4 lg:mb-6"
      >
        <BannerText>
          Manage your account information and review your account transaction
          history.
        </BannerText>
        <ButtonGroup className="mt-6">
          <Button
            accentColor="blue"
            link={`/accounts/${id}/edit`}
            testId="edit-account"
          >
            Edit account
          </Button>
          <AccountDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </Banner>
      <section className={`bg-white border rounded-lg mb-4 lg:mb-6`}>
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
      <section className="mt-4 lg:mt-6">
        <Heading>History</Heading>
        <TransactionStackedList className="mt-4" rows={transactions} />
      </section>
    </>
  );
};
