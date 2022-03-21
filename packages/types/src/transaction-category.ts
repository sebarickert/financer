type VisibilityType = 'income' | 'expense' | 'transfer';

export type ITransactionCategory = {
  _id?: any;
  owner?: string;
  name: string;
  visibility: VisibilityType[];
  parent_category_id?: any;
};
