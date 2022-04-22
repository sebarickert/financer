import {
  groupExpensesByMonth,
  ExpenseDtoWithCategories,
} from '../ExpenseFuctions';

const testData: ExpenseDtoWithCategories[] = [
  {
    categoryMappings: ['Category 1', 'Category 2'],
    fromAccount: '5fbd39c804bcfa18c50dbf31',
    description: '123',
    _id: '5fc7ce00df7e9e067f57c826',
    amount: 10,
    date: new Date('2020-11-30T00:00:00.000Z'),
    user: '5fbd378ede5ab913b62a75f3',
  },
  {
    categoryMappings: ['Category 1', 'Category 2'],
    fromAccount: '5fbd39c804bcfa18c50dbf31',
    description: '123',
    _id: '5fc7ce04df7e9e067f57c827',
    amount: 20,
    date: new Date('2020-12-02T00:00:00.000Z'),
    user: '5fbd378ede5ab913b62a75f3',
  },
  {
    categoryMappings: ['Category 1', 'Category 2'],
    fromAccount: '5fbd39c804bcfa18c50dbf31',
    description: '123',
    _id: '5fc7ce09df7e9e067f57c828',
    amount: 30,
    date: new Date('2020-12-02T00:00:00.000Z'),
    user: '5fbd378ede5ab913b62a75f3',
  },
];

test('Should calculate correct total after month change', () => {
  const expensesPerMonth = testData.reduce(groupExpensesByMonth, []);

  const firstMonth = expensesPerMonth.find(
    ({ month, year }) => month === 10 && year === 2020
  );

  const secondMonth = expensesPerMonth.find(
    ({ month, year }) => month === 11 && year === 2020
  );

  expect(firstMonth?.total).toEqual(10);
  expect(secondMonth?.total).toEqual(50);
});
