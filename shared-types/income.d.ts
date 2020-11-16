interface IIncome implements ITransaction {
  _id?: any;
  toAccount?: string;
  toBalance?: number;
  amount: number;
  description: string;
  user?: string;
}
