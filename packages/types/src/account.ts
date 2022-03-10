export interface IAccount {
  _id?: any;
  name: string;
  type: "cash" | "savings" | "investment" | "credit" | "loan";
  balance: number;
  owner?: string;
}
