interface IAccount {
  _id?: any;
  name: string;
  type: "cash" | "savings" | "investment" | "credit";
  balance: number;
  owner?: string;
}
