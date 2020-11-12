interface IAccount {
  id?: string;
  name: string;
  type: "cash" | "finance" | "credit";
  balance: number;
  owner: string;
}
