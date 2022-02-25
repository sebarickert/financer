import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Brush,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

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
import { MONTH_IN_MS } from '../../constants/months';
import { useAllTransactionCategories } from '../../hooks/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../../hooks/useAllTransactionCategoryMappings';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { capitalize } from '../../utils/capitalize';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import {
  getTransactionType,
  mapTransactionTypeToUrlPrefix,
} from '../statistics/Statistics';

import { getAccountById, getAccountTransactions } from './AccountService';

interface IAccountDeleteModalProps {
  handleDelete(): void;
}

interface IChartData {
  dateStr: string;
  date: Date;
  balance: number;
}

interface ISimpleLineChartProps {
  data: IChartData[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>): JSX.Element => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-2 bg-gray-800 shadow-lg">
        <p className="text-white">
          Balance {formatCurrency(payload[0].value as number)}
        </p>
        <p className="text-white">{label}</p>
      </div>
    );
  }

  return <div />;
};

const SimpleLineChart = ({ data }: ISimpleLineChartProps): JSX.Element => {
  const monthAgoDate = new Date().getTime() - MONTH_IN_MS;
  const monthAgoIndex = data.indexOf(
    data.find((tick) => tick.date.getTime() > monthAgoDate) || data[0]
  );

  return (
    <div className="bg-white border rounded-lg aspect-video">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c64f2" stopOpacity={0.4} />
              <stop offset="75%" stopColor="#1c64f2" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Tooltip content={CustomTooltip} />
          <YAxis
            dataKey="balance"
            axisLine={false}
            tickLine={false}
            tickCount={6}
            domain={['dataMin', 'dataMax']}
            tickFormatter={(number) => formatCurrency(number)}
            type="number"
          />
          <XAxis
            dataKey="dateStr"
            axisLine={false}
            tickLine={false}
            tickMargin={15}
            height={50}
          />
          <Area
            dataKey="balance"
            stroke="#1c64f2"
            fill="url(#color)"
            strokeWidth={2}
            isAnimationActive={false}
          />
          <Brush dataKey="dateStr" stroke="#1c64f2" startIndex={monthAgoIndex}>
            <AreaChart>
              <CartesianGrid />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Area dataKey="balance" stroke="#1c64f2" fill="#1c64f2" />
            </AreaChart>
          </Brush>
          <CartesianGrid vertical={false} opacity={0.25} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

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
  const history = useHistory();
  const deleteAccount = useDeleteAccount();
  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const [transactions, setTransactions] = useState<
    ITransactionStackedListRowProps[]
  >([]);
  const [rawTransactions, setRawTransactions] = useState<ITransaction[]>([]);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      setAccount(await getAccountById(id));
    };

    const fetchTransactions = async () => {
      setRawTransactions((await getAccountTransactions(id)).payload);
    };

    fetchAccount();
    fetchTransactions();
  }, [id]);

  useEffect(() => {
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

    setChartData(
      rawTransactions.map(
        ({
          toAccount,
          toAccountBalance = 0,
          fromAccountBalance = 0,
          date,
          amount,
        }) => ({
          dateStr: formatDate(new Date(date)),
          date: new Date(date),
          balance:
            toAccount === id
              ? toAccountBalance + amount
              : fromAccountBalance - amount,
        })
      )
    );
  }, [id, rawTransactions, transactionCategories, transactionCategoryMappings]);

  const handleDelete = async () => {
    await deleteAccount(id);
    history.push('/accounts');
  };

  return typeof account === 'undefined' || transactions === null ? (
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
      <SimpleLineChart data={chartData} />
      <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tighter sm:text-3xl">
        History
      </h2>
      {/* <TransactionStackedList className="mt-4" rows={transactions} /> */}
    </>
  );
};
