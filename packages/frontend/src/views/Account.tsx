import { ChartLine, Info } from 'lucide-react';
import { FC, useMemo } from 'react';

import {
  SchemaAccountBalanceHistoryDto,
  SchemaAccountDto,
} from '@/api/ssr-financer-api';
import { BalanceDisplay } from '@/blocks/BalanceDisplay';
import { Card } from '@/blocks/Card/Card';
import { DetailsItem, DetailsList } from '@/blocks/DetailsList';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { ACCOUNT_TYPE_MAPPING } from '@/constants/account/ACCOUNT_TYPE_MAPPING';
import { AccountBalanceHistoryChart } from '@/features/account/AccountBalanceHistoryChart';
import { TransactionListWithMonthlyPager } from '@/features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { formatCurrency } from '@/utils/formatCurrency';

interface AccountProps {
  account: SchemaAccountDto;
  balanceHistory: SchemaAccountBalanceHistoryDto[];
  queryDate?: string;
}

export const Account: FC<AccountProps> = ({
  account,
  balanceHistory,
  queryDate,
}) => {
  const accountDetails: DetailsItem[] = useMemo(
    () => [
      {
        Icon: Info,
        label: 'Account Type',
        description: ACCOUNT_TYPE_MAPPING[account.type].label,
      },
    ],
    [account.type],
  );

  return (
    <section className="grid gap-4">
      <Card className="grid gap-6">
        <BalanceDisplay
          label="Balance"
          amount={account.currentDateBalance ?? account.balance}
        >
          {Boolean(account.currentDateBalance) &&
            account.currentDateBalance !== account.balance && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                <span>Upcoming Balance: </span>
                <span data-testid="upcoming-balance">
                  {formatCurrency(account.balance)}
                </span>
              </p>
            )}
        </BalanceDisplay>
        <DetailsList testId="account-details" items={accountDetails} />
      </Card>
      {balanceHistory.length < 3 && (
        <InfoMessageBlock title="Not Enough Data Yet" Icon={ChartLine}>
          There isn&apos;t enough data to generate a meaningful balance history.
          Add more transactions to track your financial trends over time.
        </InfoMessageBlock>
      )}
      {balanceHistory.length >= 3 && (
        <AccountBalanceHistoryChart data={balanceHistory} />
      )}
      <TransactionListWithMonthlyPager
        queryDate={queryDate}
        filterOptions={{ accountId: account.id }}
      />
    </section>
  );
};
