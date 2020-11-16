interface ITransaction {
  _id?: any;
  fromAccount?: string;
  toAccount?: string;
  fromBalance?: string;
  toBalance?: number;
  amount: number;
  description: string;
  user?: string;
}
