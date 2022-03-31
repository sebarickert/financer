export type IIncome = {
  _id?: any;
  toAccount: string;
  amount: number;
  description: string;
  user?: string;
  date: Date | string;
};
