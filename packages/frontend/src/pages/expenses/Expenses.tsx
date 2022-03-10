import { Heading } from '../../components/heading/heading';
import { Loader } from '../../components/loader/loader';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { SEO } from '../../components/seo/seo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { useAllExpensesGroupByMonth } from '../../hooks/expense/useAllExpenses';
import { formatCurrency } from '../../utils/formatCurrency';

export const Expenses = (): JSX.Element => {
  const [expenses] = useAllExpensesGroupByMonth();

  return expenses === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <SEO title="Expenses" />
      <section className="mb-8">
        <Heading variant="h1" className="mb-6">
          Expenses
        </Heading>
        <QuickLinksItem
          title="Add expense"
          link="/statistics/expenses/add"
          iconName="download"
          iconBackgroundColor="red"
          testId="add-expense"
        />
      </section>
      {expenses.map(({ year, month, rows, total }) => (
        <section
          className="mb-12"
          aria-label={`IOverview of income transactions for ${monthNames[month]}, ${year}`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-0 z-10 bg-white-off py-4 -mt-4">
            <h2 className="text-2xl font-bold tracking-tighter truncate sm:text-3xl">
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
