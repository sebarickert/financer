export type IExpense = {
  _id?: any;
  fromAccount?: string;
  amount: number;
  description: string;
  user?: string;
  date: Date | string;
};
