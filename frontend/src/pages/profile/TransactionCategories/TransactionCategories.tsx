import React, { useEffect, useState } from 'react';

import { Banner } from '../../../components/banner/banner';
import { BannerText } from '../../../components/banner/banner.text';
import { Button } from '../../../components/button/button';
import { Loader } from '../../../components/loader/loader';
import { SEO } from '../../../components/seo/seo';
import { StackedList } from '../../../components/stacked-list/stacked-list';
import { IStackedListRowProps } from '../../../components/stacked-list/stacked-list.row';
import { useAllTransactionCategoriesWithCategoryTree } from '../../../hooks/useAllTransactionCategories';

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
      <SEO title="Transaction categories" />
      <Banner title="Transaction categories" headindType="h1" className="mb-4">
        <BannerText>
          Below you are able to add, delete or edit your transaction categories.
        </BannerText>
        <Button
          link="/profile/transaction-categories/add"
          accentColor="green"
          className="mt-6"
        >
          Add transaction category
        </Button>
      </Banner>
      <StackedList rows={transactionCategories} />
    </>
  );
};
