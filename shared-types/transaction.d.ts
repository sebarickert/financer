interface ITransaction {
  _id?: any;
  fromAccount?: string;
  toAccount?: string;
  fromAccountBalance?: number;
  toAccountBalance?: number;
  amount: number;
  description?: string;
  user?: string;
  date: Date;
}
