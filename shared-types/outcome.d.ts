interface IOutcome implements ITransaction {
  _id?: any;
  fromAccount?: string;
  fromBalance?: string;
  amount: number;
  description: string;
  user?: string;
}
