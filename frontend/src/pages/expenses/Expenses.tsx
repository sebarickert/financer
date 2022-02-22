import { Banner } from '../../components/banner/banner';
import { BannerText } from '../../components/banner/banner.text';
import { Button } from '../../components/button/button';
import { Loader } from '../../components/loader/loader';
import { SEO } from '../../components/seo/seo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { useAllExpensesGroupByMonth } from '../../hooks/useAllExpenses';
import { formatCurrency } from '../../utils/formatCurrency';

export const getAllUserTransactionCategoryMappings = async (): Promise<
  ITransactionCategoryMapping[]
> => (await fetch('/api/transaction-categories-mapping')).json();

export const Expenses = (): JSX.Element => {
  const expenses = useAllExpensesGroupByMonth();

  return expenses === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Expenses" />
      <Banner title="Expenses" headindType="h1" className="mb-8">
        <BannerText>Overview page for your expense transactions.</BannerText>
        <Button
          link="/statistics/expenses/add"
          className="mt-6"
          accentColor="red"
          testId="add-expense"
        >
          Add expense
        </Button>
      </Banner>
      {expenses.map(({ year, month, rows, total }) => (
        <section
          className="mb-12"
          aria-label={`IOverview of income transactions for ${monthNames[month]}, ${year}`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-0 z-10 bg-white-off py-4 -mt-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter truncate">
              {`${monthNames[month]}, ${year}`}
            </h2>
            <p className="font-semibold text-gray-600">
              <span className="sr-only">Total: </span>
              {Number.isNaN(total) ? '-' : formatCurrency(total)}
            </p>
          </div>
          <TransactionStackedList rows={rows} />
        </section>
      ))}
    </>
  );
};
