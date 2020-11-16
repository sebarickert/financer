interface IIncome implements ITransaction {
  _id?: any;
  toAccount: string;
  toAccountBalance?: number;
  amount: number;
  description?: string;
  user?: string;
  date: Date;
}
