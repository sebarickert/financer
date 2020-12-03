import { groupIncomesByMonth } from "../IncomeFuctions";

const testData: IIncome[] = [
  {
    toAccount: "5fbd39c804bcfa18c50dbf31",
    toAccountBalance: -122182.99999999895,
    description: "asd",
    _id: "5fc7e34bdf7e9e067f57c829",
    amount: 10,
    date: "2020-11-18T00:00:00.000Z",
    user: "5fbd378ede5ab913b62a75f3",
  },
  {
    toAccount: "5fbd39c804bcfa18c50dbf31",
    toAccountBalance: -122172.99999999895,
    description: "asd",
    _id: "5fc7e351df7e9e067f57c82a",
    amount: 20,
    date: "2020-12-02T00:00:00.000Z",
    user: "5fbd378ede5ab913b62a75f3",
  },
  {
    toAccount: "5fbd39c804bcfa18c50dbf31",
    toAccountBalance: -122152.99999999895,
    description: "ad",
    _id: "5fc7e355df7e9e067f57c82b",
    amount: 30,
    date: "2020-12-02T00:00:00.000Z",
    user: "5fbd378ede5ab913b62a75f3",
  },
];

const accountData: IAccount[] = [
  {
    _id: "5fbd39c804bcfa18c50dbf31",
    balance: -123345.99999999895,
    name: "Säästötili",
    type: "savings",
    owner: "5fbd378ede5ab913b62a75f3",
  },
];

test("Should calculate correct total after month change", () => {
  const incomesPerMonth = testData.reduce(groupIncomesByMonth(accountData), []);

  const firstMonth = incomesPerMonth.find(
    ({ month, year }) => month === 10 && year === 2020
  );

  const secondMonth = incomesPerMonth.find(
    ({ month, year }) => month === 11 && year === 2020
  );

  expect(firstMonth?.total).toEqual(10);
  expect(secondMonth?.total).toEqual(50);
});
