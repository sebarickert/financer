type VisibilityType = 'income' | 'expense' | 'transfer';

export interface ITransactionCategory {
  _id?: any;
  owner?: string;
  name: string;
  visibility: VisibilityType[];
  parent_category_id?: any;
}
