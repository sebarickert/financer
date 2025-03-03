import { Info, Tag } from 'lucide-react';
import { FC, useMemo } from 'react';

import { SchemaTransactionCategoryDto } from '@/api/ssr-financer-api';
import { Card } from '@/blocks/Card/Card';
import { DetailsItem, DetailsList } from '@/blocks/DetailsList';
import { TransactionListWithMonthlyPager } from '@/features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { capitalize } from '@/utils/capitalize';
import { parseParentCategoryPath } from 'src/services/TransactionCategoriesService';

interface CategoryProps {
  category: SchemaTransactionCategoryDto;
  categories: readonly SchemaTransactionCategoryDto[];
  parentTransactionCategoryId: string;
  queryDate?: string;
}

export const Category: FC<CategoryProps> = ({
  category,
  categories,
  queryDate,
  parentTransactionCategoryId,
}) => {
  const categoryDetails: DetailsItem[] = useMemo(() => {
    const categoryVisibilityCapitalized = category.visibility.map((item) =>
      capitalize(item),
    );

    const formatter = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    });

    return [
      {
        Icon: Tag,
        label: 'Name',
        description: category.name,
      },
      ...(category.parentCategoryId
        ? [
            {
              Icon: Tag,
              label: 'Parent Category',
              description:
                parseParentCategoryPath(
                  categories,
                  category.parentCategoryId,
                ) ?? '-',
            },
          ]
        : []),
      ...(categoryVisibilityCapitalized.length > 0
        ? [
            {
              Icon: Info,
              label:
                categoryVisibilityCapitalized.length > 1
                  ? 'Transaction Types'
                  : 'Transaction Type',
              description: formatter.format(categoryVisibilityCapitalized),
            },
          ]
        : []),
    ];
  }, [
    categories,
    category.name,
    category.parentCategoryId,
    category.visibility,
  ]);

  return (
    <section className="grid gap-4">
      <Card>
        <DetailsList items={categoryDetails} />
      </Card>
      <TransactionListWithMonthlyPager
        filterOptions={{
          parentTransactionCategory: parentTransactionCategoryId,
        }}
        queryDate={queryDate}
      />
    </section>
  );
};
