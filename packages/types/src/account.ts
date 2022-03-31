export type IAccount = {
  _id?: any;
  name: string;
  type: 'cash' | 'savings' | 'investment' | 'credit' | 'loan';
  balance: number;
  owner?: string;
};

export type AccountBalanceHistoryDto = {
  date: Date;
  amount: number;
  balance: number;
};
