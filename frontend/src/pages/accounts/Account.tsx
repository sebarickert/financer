import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { SEO } from '../../components/seo/seo';
import { StatsGroup } from '../../components/stats/stats.group';
import { StatsItem } from '../../components/stats/stats.item';
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
  const history = useHistory();
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
    await deleteAccount(id);
    history.push('/accounts');
  };

  return !account || !transactions ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${account.name}`} />
      <Banner title={account.name} headindType="h1" testId="account-banner">
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
      <StatsGroup className="mt-8 mb-4">
        <StatsItem statLabel="Type" testId="type">
          {capitalize(account.type)}
        </StatsItem>
        <StatsItem statLabel="Balance" testId="balance">
          {formatCurrency(account.balance)}
        </StatsItem>
      </StatsGroup>
      <AccountBalanceHistoryChart accountId={id} />
      <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tighter sm:text-3xl">
        History
      </h2>
      <TransactionStackedList className="mt-4" rows={transactions} />
    </>
  );
};
