import { TransactionCategoryDto } from '$api/generated/financerApi';

export type TransactionCategoryDtoWithCategoryTree = TransactionCategoryDto & {
  categoryTree: string;
};
