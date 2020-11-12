interface IAccount {
  id?: any;
  name: string;
  type: "cash" | "savings" | "investment" | "credit";
  balance: number;
  owner: string;
}
