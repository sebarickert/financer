import { AccountsFindAllByUserApiArg } from '$api/generated/financerApi';
import { getServerData } from '$ssr/get-server-data';

export const getTotalBalance = async (
  filterOptions: Pick<AccountsFindAllByUserApiArg, 'accountTypes'> = {
    accountTypes: undefined,
  },
) => {
  const { data: accounts } = await getServerData(
    'accountsFindAllByUser',
    filterOptions,
  );

  if (!accounts?.data.length) {
    return NaN;
  }

  return accounts.data.reduce(
    (currentTotal, { balance }) => currentTotal + balance,
    0,
  );
};
