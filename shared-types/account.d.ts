interface IAccount {
  id?: string;
  name: string;
  type: "cash" | "savings" | "investment" | "credit";
  balance: number;
  owner: string;
}
