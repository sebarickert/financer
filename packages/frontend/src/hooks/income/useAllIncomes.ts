import { IncomeDto, AccountType, PaginationDto } from '@local/types';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

import {
  groupIncomesByMonth,
  IncomesPerMonth,
  sortIncomesByDate,
  sortIncomeStacksByMonth,
} from '../../pages/income/IncomeFuctions';
import { getAllIncomes } from '../../services/IncomeService';
import { TransactionFilterOptions } from '../../services/TransactionService';
import { useAllAccountsByType } from '../account/useAllAccounts';
import { useUserTransactionListChunkSize } from '../profile/user-preference/useUserTransactionListChunkSize';
import { useAllTransactionCategories } from '../transactionCategories/useAllTransactionCategories';
import { useAllTransactionCategoryMappings } from '../transactionCategoryMapping/useAllTransactionCategoryMappings';
import { PagerOptions, usePager } from '../usePager';

type UseAllIncomesPagedReturn = {
  data: PaginationDto<IncomeDto<string>[]>;
  pagerOptions: PagerOptions;
};

export const useAllIncomes = (): IncomeDto[] => {
  const { data, error } = useQuery(['incomes'], () => getAllIncomes());

  if (error || !data) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return data.data;
};

export const useAllIncomesPaged = (
  intialPage = 1,
  requestParams: Omit<TransactionFilterOptions, 'page'> = {}
): UseAllIncomesPagedReturn => {
  const [chunkAmount] = useUserTransactionListChunkSize();
  const { page, getLoadPageFunctions } = usePager(intialPage);

  const { data, error } = useQuery(['incomes', page, requestParams], () =>
    getAllIncomes({ limit: chunkAmount, ...requestParams, page })
  );

  if (!data || error) {
    throw new Error(`Missing data. Error: ${JSON.stringify(error ?? data)}`);
  }

  return {
    data: data,
    pagerOptions: getLoadPageFunctions(data),
  };
};

export const useCurrentMonthIncomesTotalAmount = (): number => {
  const incomes = useAllIncomes();
  const [totalAmount, setTotalAmount] = useState(NaN);

  useEffect(() => {
    if (incomes === null) return;

    const total = incomes.reduce((currentTotal, { amount, date }) => {
      const currentMonth = new Date().getMonth() + 1;
      const month = new Date(date).getMonth() + 1;
      const currentYear = new Date().getFullYear();

      if (
        currentMonth === month &&
        currentYear === new Date(date).getFullYear()
      ) {
        return currentTotal + amount;
      }

      return currentTotal;
    }, 0);

    setTotalAmount(total);
  }, [incomes]);

  return totalAmount;
};

export const useAllIncomesGroupByMonth = (
  initialForbiddenAccountTypes: AccountType[] = []
): [IncomesPerMonth[], React.Dispatch<React.SetStateAction<AccountType[]>>] => {
  const incomes = useAllIncomes();
  const [allForbiddenAccounts, setTargetTypes] = useAllAccountsByType([]);
  const [groupedIncomes, setGroupedIncomes] = useState<IncomesPerMonth[]>([]);
  const transactionCategoryMappings = useAllTransactionCategoryMappings();
  const transactionCategories = useAllTransactionCategories();
  const [forbiddenAccountTypes, setForbiddenAccountTypes] = useState<
    AccountType[]
  >(initialForbiddenAccountTypes);

  useEffect(() => {
    const forbiddenAccountIds = allForbiddenAccounts?.map(({ _id }) => _id);

    setGroupedIncomes(
      incomes
        .filter(({ _id }) => !forbiddenAccountIds?.includes(_id))
        .map(({ _id, ...rest }) => {
          const categoryMappings = transactionCategoryMappings
            ?.filter(({ transaction_id }) => transaction_id === _id)
            .map(
              ({ category_id }) =>
                transactionCategories.find(
                  ({ _id: categoryId }) => category_id === categoryId
                )?.name
            )
            .filter(
              (categoryName) => typeof categoryName !== 'undefined'
              // @todo: Fix this type.
            ) as string[];

          return { _id, ...rest, categoryMappings };
        })
        .reduce<IncomesPerMonth[]>(groupIncomesByMonth, [])
        .sort(sortIncomeStacksByMonth)
        .map(sortIncomesByDate)
    );
  }, [
    allForbiddenAccounts,
    incomes,
    transactionCategories,
    transactionCategoryMappings,
  ]);

  useEffect(() => {
    setTargetTypes(forbiddenAccountTypes);
  }, [forbiddenAccountTypes, setTargetTypes]);

  return [groupedIncomes, setForbiddenAccountTypes];
};
