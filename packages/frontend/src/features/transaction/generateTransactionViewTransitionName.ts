import { SchemaTransactionListItemCategoryDto } from '@/api/ssr-financer-api';

export const generateTransactionViewTransitionName = (
  id: string,
  categories: readonly Pick<SchemaTransactionListItemCategoryDto, 'id'>[] = [],
) => ({
  description: `transaction-${id}-description`,
  amount: `transaction-${id}-amount`,
  date: `transaction-${id}-date`,
  type: `transaction-${id}-type`,
  typeIcon: `transaction-${id}-type-icon`,
  categories: new Map<string, string>(
    categories.map((category) => [
      category.id,
      `transaction-${id}-category-${category.id}`,
    ]),
  ),
});
