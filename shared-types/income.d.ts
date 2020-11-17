interface IIncome {
  _id?: any;
  toAccount: string;
  toAccountBalance?: number;
  amount: number;
  description?: string;
  user?: string;
  date: Date;
}
