interface IExpense {
  _id?: any;
  fromAccount?: string;
  fromAccountBalance?: number;
  amount: number;
  description: string;
  user?: string;
  date: Date | string;
}
