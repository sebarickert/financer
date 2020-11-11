interface IAccount {
  id?: string;
  name: string;
  type: "cash" | "finance" | "credit";
  saldo: number;
  owner: string;
}
