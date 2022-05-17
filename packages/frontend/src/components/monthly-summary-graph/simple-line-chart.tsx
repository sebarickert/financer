import {
  TooltipProps,
  ResponsiveContainer,
  AreaChart,
  Tooltip,
  YAxis,
  XAxis,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateShort } from '../../utils/formatDate';

export type BalanceHistory = {
  date: Date;
  balance: number;
};

type SimpleLineChartProps = {
  data: BalanceHistory[];
};

type TooltopPropsWithLastDataItem = TooltipProps<ValueType, NameType> & {
  lastDataItem: BalanceHistory;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  lastDataItem,
}: TooltopPropsWithLastDataItem): JSX.Element => {
  if (active && payload && payload.length && lastDataItem) {
    const isLastItem =
      lastDataItem.date.getTime() === new Date(label).getTime();

    return (
      <div className="px-4 py-2 bg-gray-800 rounded-md shadow-lg">
        <p className="text-white">
          Balance {formatCurrency(payload[0].value as number)}
        </p>
        <p className="text-white">
          {isLastItem ? 'Current' : formatDateShort(new Date(label))}
        </p>
      </div>
    );
  }

  return <div />;
};

export const CustomXAxisTick = ({
  x,
  y,
  payload,
  index,
}: {
  x: number;
  y: number;
  payload: { value: string };
  index: number;
}) => {
  if (index === 0 || index === 6) return null;

  return (
    <g className={`text-xs md:text-sm`}>
      <text x={x} y={y + 18} textAnchor="middle" fill="">
        {formatDateShort(new Date(payload.value))}
      </text>
    </g>
  );
};

export const SimpleLineChart = ({
  data,
}: SimpleLineChartProps): JSX.Element => {
  return (
    <ResponsiveContainer>
      <AreaChart
        data={data.map(({ date, balance }) => ({
          dateStr: date.toISOString(),
          date,
          balance,
        }))}
        margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c64f2" stopOpacity={0.4} />
            <stop offset="75%" stopColor="#1c64f2" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Tooltip
          content={(props) => (
            <CustomTooltip {...props} lastDataItem={data[data.length - 1]} />
          )}
          isAnimationActive={false}
        />
        <YAxis dataKey="balance" domain={['dataMin - 1000', 'auto']} hide />
        <XAxis
          dataKey="dateStr"
          axisLine={false}
          tickLine={false}
          height={40}
          interval={1}
          tick={(props) => <CustomXAxisTick {...props} />}
        />
        <Area
          dataKey="balance"
          stroke="#1c64f2"
          fill="url(#color)"
          strokeWidth={2}
          isAnimationActive={false}
        />
        <CartesianGrid vertical={false} opacity={0.25} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
