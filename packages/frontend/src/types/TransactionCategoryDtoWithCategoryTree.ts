import { SchemaTransactionCategoryDto } from '@/api/ssr-financer-api';

export type TransactionCategoryDtoWithCategoryTree =
  SchemaTransactionCategoryDto & {
    categoryTree: string;
  };
