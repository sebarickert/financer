import { FC } from 'react';

import { IncomeListingContainer } from '$container/incomes/income.listing.container';

type IncomesPageProps = {
  searchParams: {
    date?: string;
    page?: string;
  };
};

const IncomesPage: FC<IncomesPageProps> = ({
  searchParams: { date, page },
}) => {
  return (
    <IncomeListingContainer
      date={date as string}
      page={parseInt(page as string)}
    />
  );
};

export default IncomesPage;
