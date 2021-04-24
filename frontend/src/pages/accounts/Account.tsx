import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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
} from "recharts";
import Button from "../../components/button/button";
import ButtonGroup from "../../components/button/button.group";
import Container from "../../components/container/container";
import DescriptionList from "../../components/description-list/description-list";
import DescriptionListItem from "../../components/description-list/description-list.item";
import Hero from "../../components/hero/hero";
import Loader from "../../components/loader/loader";
import ModalConfirm from "../../components/modal/confirm/modal.confirm";
import SEO from "../../components/seo/seo";
import StackedList from "../../components/stacked-list/stacked-list";
import { ICustomStackedListRowProps } from "../../components/stacked-list/stacked-list.row";
import { MONTH_IN_MS } from "../../constants/months";
import capitalize from "../../utils/capitalize";
import formatCurrency from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  deleteAccount,
  getAccountById,
  getAccountTransactions,
} from "./AccountService";

interface IProps {
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
      <div className="py-2 px-4 bg-blue-600 shadow-lg rounded-md">
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
    <div style={{ width: "100%", height: "33vh", minHeight: "450px" }}>
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
            domain={["dataMin", "dataMax"]}
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
          />
          <CartesianGrid vertical={false} opacity={0.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const AccountDeleteModal = ({ handleDelete }: IProps) => (
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

const Account = (): JSX.Element => {
  const history = useHistory();
  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const [transactions, setTransactions] = useState<
    ICustomStackedListRowProps[]
  >([]);
  const [chartData, setChartData] = useState<IChartData[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAccount = async () => {
      setAccount(await getAccountById(id));
    };

    const fetchTransactions = async () => {
      const rawTransactions = (await getAccountTransactions(id)).payload;

      setTransactions(
        rawTransactions
          .map(
            ({
              date: dateStr,
              fromAccount,
              toAccount,
              description = "Unknown",
              amount,
              _id,
            }): ICustomStackedListRowProps => {
              const date = new Date(dateStr);

              if (toAccount === id) {
                return {
                  label: description,
                  additionalLabel: formatCurrency(amount),
                  additionalInformation: [formatDate(date)],
                  id: _id,
                  date,
                  tags: [
                    {
                      label: !fromAccount ? "Income" : "Transfer",
                      color: !fromAccount ? "green" : "blue",
                    },
                  ],
                };
              }

              return {
                label: description,
                additionalLabel: formatCurrency(amount),
                additionalInformation: [formatDate(date)],
                id: _id,
                date,
                tags: [
                  {
                    label: !toAccount ? "Expense" : "Transfer",
                    color: !toAccount ? "red" : "blue",
                  },
                ],
              };
            }
          )
          .sort((a, b) => (a.date > b.date ? -1 : 1))
      );
      setChartData(
        rawTransactions.map(
          ({ toAccount, toAccountBalance, fromAccountBalance, date }) => ({
            dateStr: formatDate(new Date(date)),
            date: new Date(date),
            balance:
              toAccount === id
                ? toAccountBalance || 0
                : fromAccountBalance || 0,
          })
        )
      );
    };

    fetchAccount();
    fetchTransactions();
  }, [id]);

  const handleDelete = async () => {
    await deleteAccount(id);
    history.push("/accounts");
  };

  return typeof account === "undefined" || transactions === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title={`${account.name} | Accounts`} />
      <Hero accent="Account" accentColor="blue" label={account.name}>
        Below you are able to edit your accounts information and check your
        transaction history as well as balance.
      </Hero>
      <Container className="mt-12">
        <ButtonGroup>
          <Button accentColor="blue" link={`/accounts/${id}/edit`}>
            Edit account
          </Button>
          <AccountDeleteModal handleDelete={handleDelete} />
        </ButtonGroup>
      </Container>
      <DescriptionList label="Account details" className="mt-12">
        <DescriptionListItem label="Balance">
          {formatCurrency(account.balance)}
        </DescriptionListItem>
        <DescriptionListItem label="Type">
          {capitalize(account.type)}
        </DescriptionListItem>
      </DescriptionList>
      <Container className="mt-12">
        <SimpleLineChart data={chartData} />
      </Container>
      {transactions.length > 0 && (
        <Container className="mt-12">
          <StackedList label="Account transactions" rows={transactions} />
        </Container>
      )}
    </>
  );
};

export default Account;
