import { useEffect, useState } from 'react';

import { Heading } from '../../../components/heading/heading';
import { Loader } from '../../../components/loader/loader';
import { QuickLinksItem } from '../../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { StackedList } from '../../../components/stacked-list/stacked-list';
import { IStackedListRowProps } from '../../../components/stacked-list/stacked-list.row';
import { useAllTransactionCategoriesWithCategoryTree } from '../../../hooks/transactionCategories/useAllTransactionCategories';

export const TransactionCategories = (): JSX.Element => {
  const transactionCategoriesRaw =
    useAllTransactionCategoriesWithCategoryTree();

  const [transactionCategories, setTransactionCategories] = useState<
    IStackedListRowProps[]
  >([]);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    setTransactionCategories(
      transactionCategoriesRaw.map(
        ({ _id, name, visibility, categoryTree }) => ({
          label: name,
          actions: [
            {
              label: 'Edit',
              color: 'blue',
              link: `/profile/transaction-categories/${_id}/edit`,
            },
          ],
          additionalInformation: [categoryTree, visibility.join(', ')],
          id: _id,
        })
      )
    );
  }, [transactionCategoriesRaw]);

  return transactionCategoriesRaw === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      <UpdatePageInfo title="Categories" />
      <section className="mb-8">
        <Heading variant="h1" className="mb-6">
          Categories
        </Heading>
        <QuickLinksItem
          title="Add category"
          link="/profile/transaction-categories/add"
          iconName="tag"
          iconBackgroundColor="blue"
          testId="add-category"
        />
      </section>
      <StackedList rows={transactionCategories} rowTestId="category-row" />
    </>
  );
};
