interface ITransaction {
  _id?: any;
  fromAccount?: string;
  toAccount?: string;
  fromAccountBalance?: string;
  toAccountBalance?: number;
  amount: number;
  description?: string;
  user?: string;
}
