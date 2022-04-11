export enum AccounType {
  cash = 'cash',
  savings = 'savings',
  investment = 'investment',
  credit = 'credit',
  loan = 'loan',
}

export type IAccount = {
  _id?: any;
  name: string;
  type: AccounType;
  balance: number;
  owner?: string;
};

export type AccountBalanceHistoryDto = {
  date: Date;
  amount: number;
  balance: number;
};
