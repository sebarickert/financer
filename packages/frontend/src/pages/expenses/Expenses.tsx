import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { Loader } from '../../components/loader/loader';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
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
      <UpdatePageInfo title="Expenses" />
      <section className="mb-8">
        <QuickLinksItem
          title="Add expense"
          link="/statistics/expenses/add"
          iconName={IconName.download}
          iconBackgroundColor="red"
          testId="add-expense"
        />
      </section>
      {expenses.map(({ year, month, rows, total }) => (
        <section
          className="mb-12"
          aria-label={`IOverview of income transactions for ${monthNames[month]}, ${year}`}
        >
          <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-[-1px] z-10 bg-white py-4 -mt-4">
            <Heading>{`${monthNames[month]}, ${year}`}</Heading>
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
