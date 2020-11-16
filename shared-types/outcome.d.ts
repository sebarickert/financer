interface IOutcome implements ITransaction {
  _id?: any;
  fromAccount?: string;
  fromAccountBalance?: string;
  amount: number;
  description?: string;
  user?: string;
}
