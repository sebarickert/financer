import React, { useEffect, useState } from 'react';

import { StackedList } from '../../components/stacked-list/stacked-list';
import { ICustomStackedListRowProps } from '../../components/stacked-list/stacked-list.row';
import { useAllAccounts } from '../../hooks/useAllAccounts';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { getAllTransferTranscations } from '../transfers/TransferService';

interface ITransferListProps {
  className?: string;
}

export const TransferList = ({
  className = '',
}: ITransferListProps): JSX.Element => {
  const [transfersRaw, setTransfersRaw] = useState<ITransaction[] | null>(null);
  const [transfers, setTransfers] = useState<ICustomStackedListRowProps[]>([]);
  const accounts = useAllAccounts();

  useEffect(() => {
    const fetchTransfers = async () => {
      setTransfersRaw((await getAllTransferTranscations()).payload);
    };

    fetchTransfers();
  }, []);

  useEffect(() => {
    if (transfersRaw === null || accounts === null) return;

    setTransfers(
      transfersRaw
        .map(
          ({
            date: dateStr,
            amount,
            fromAccount,
            toAccount,
            _id,
          }): ICustomStackedListRowProps => {
            const date = new Date(dateStr);
            const fromAccountName =
              accounts.find(
                ({ _id: targetAccountId }) => targetAccountId === fromAccount
              )?.name || 'unknown';
            const toAccountName =
              accounts.find(
                ({ _id: targetAccountId }) => targetAccountId === toAccount
              )?.name || 'unknown';

            return {
              label: `${fromAccountName} --> ${toAccountName}`,
              additionalLabel: formatCurrency(amount),
              additionalInformation: [formatDate(date)],
              id: _id,
              link: `/statistics/transfers/${_id}`,
              date,
              tags: [
                {
                  label: 'Transfer',
                  color: 'blue',
                },
              ],
            };
          }
        )
        .sort((a, b) => (a.date > b.date ? -1 : 1))
    );
  }, [transfersRaw, accounts]);

  return (
    <div className={className}>
      <StackedList label="Your transfers" rows={transfers} />
    </div>
  );
};
