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

import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { Button } from '../../components/button/button';
import { ButtonGroup } from '../../components/button/button.group';
import { Loader } from '../../components/loader/loader';
import { ModalConfirm } from '../../components/modal/confirm/modal.confirm';
import { SEO } from '../../components/seo/seo';
import { Stats } from '../../components/stats/stats';
import { StatsItem } from '../../components/stats/stats.item';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { ITransactionStackedListRowProps } from '../../components/transaction-stacked-list/transaction-stacked-list.row';
import { MONTH_IN_MS } from '../../constants/months';
import { capitalize } from '../../utils/capitalize';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { getAllUserTransactionCategoryMappings } from '../expenses/Expenses';
import { getAllTransactionCategories } from '../profile/TransactionCategories/TransactionCategoriesService';
import {
  getTransactionType,
  mapTransactionTypeToUrlPrefix,
} from '../statistics/Statistics';

import {
  deleteAccount,
  getAccountById,
  getAccountTransactions,
} from './AccountService';

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
}: TooltipProps): JSX.Element => {
  if (active && payload && payload.length) {
    return (
      <div className="py-2 px-4 bg-gray-800 shadow-lg">
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
    <div className="bg-white rounded-lg border pl-2 py-6 pr-6">
      <div style={{ width: '100%', height: '33vh', minHeight: '450px' }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
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
              width={105}
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
            />
            <Brush
              dataKey="dateStr"
              height={30}
              stroke="#1c64f2"
              startIndex={monthAgoIndex}
            >
              <AreaChart>
                <CartesianGrid />
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Area dataKey="balance" stroke="#1c64f2" fill="#1c64f2" />
              </AreaChart>
            </Brush>
            <CartesianGrid vertical={false} opacity={0.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
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
  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const [transactions, setTransactions] = useState<
    ITransactionStackedListRowProps[]
  >([]);
  const [rawTransactions, setRawTransactions] = useState<ITransaction[]>([]);
  const [transactionCategoryMappings, setTransactionCategoryMappings] =
    useState<ITransactionCategoryMapping[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<
    ITransactionCategory[]
  >([]);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      setAccount(await getAccountById(id));
    };

    const fetchAllTransactionCategories = async () => {
      setTransactionCategories(await getAllTransactionCategories());
    };
    const fetchAllUserTransactionCategoryMappings = async () => {
      setTransactionCategoryMappings(
        await getAllUserTransactionCategoryMappings()
      );
    };

    const fetchTransactions = async () => {
      setRawTransactions((await getAccountTransactions(id)).payload);
    };

    fetchAccount();
    fetchAllTransactionCategories();
    fetchAllUserTransactionCategoryMappings();
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
        .sort((a, b) => (a.date > b.date ? -1 : 1))
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
      <Stats className="my-8">
        <StatsItem statLabel="Type" testId="type">
          {capitalize(account.type)}
        </StatsItem>
        <StatsItem statLabel="Balance" testId="balance">
          {formatCurrency(account.balance)}
        </StatsItem>
      </Stats>
      <SimpleLineChart data={chartData} />
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter mt-8 mb-4">
        History
      </h2>
      <TransactionStackedList className="mt-4" rows={transactions} />
    </>
  );
};
