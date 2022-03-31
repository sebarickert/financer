export type ITransaction = {
  _id?: any;
  fromAccount?: string;
  toAccount?: string;
  amount: number;
  description?: string;
  user?: string;
  date: Date | string;
};
