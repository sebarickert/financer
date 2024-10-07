import { TransactionCategoryMapping } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export const transactionCategoryMappingRepoFindByIdMock: Record<
  string,
  TransactionCategoryMapping[]
> = {
  '624befb66ba655edad8f824e': [
    {
      id: '637e234fbda8050a85b1b6b7',
      amount: new Decimal(500),
      categoryId: '623b58ada3deba9879422fbf',
      createdAt: new Date('2024-05-10T10:21:18.365Z'),
      description: '',
      userId: '61460d7354ea082ad0256749',
      transactionId: '624befb66ba655edad8f824e',
      updatedAt: new Date('2024-05-10T10:21:18.365Z'),
    },
    {
      id: '637e234fbda8050a85b1b6b8',
      amount: new Decimal(1358.18),
      categoryId: '623b6b91a3deba9879422fe1',
      createdAt: new Date('2024-05-10T10:21:18.365Z'),
      description: '',
      userId: '61460d7354ea082ad0256749',
      transactionId: '624befb66ba655edad8f824e',
      updatedAt: new Date('2024-05-10T10:21:18.365Z'),
    },
  ],
  '663df679d8ef53dcb2bc9411': [],
  '663df5ccd8ef53dcb2bc93a0': [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transactionCategoryMappingRepoFindAllByUserIdTransactionData: any[] =
  [
    {
      id: '637e234fbda8050a85b1b6b7',
      amount: new Decimal(500),
      categoryId: '623b58ada3deba9879422fbf',
      createdAt: new Date('2024-05-10T10:21:18.365Z'),
      description: '',
      userId: '61460d7354ea082ad0256749',
      transactionId: '624befb66ba655edad8f824e',
      updatedAt: new Date('2024-05-10T10:21:18.365Z'),
      transaction: {
        date: new Date('2022-01-27T23:23:00.000Z'),
        fromAccount: '61460de154ea082ad0256786',
        toAccount: null,
      },
    },
    {
      id: '637e2371bda8050a85b1b70b',
      amount: new Decimal(635.98),
      categoryId: '623b58ada3deba9879422fbf',
      createdAt: new Date('2024-05-10T10:21:18.365Z'),
      description: '',
      userId: '61460d7354ea082ad0256749',
      transactionId: '624befb96ba655edad8f82ad',
      updatedAt: new Date('2024-05-10T10:21:18.365Z'),
      transaction: {
        date: new Date('2022-01-26T04:36:00.000Z'),
        fromAccount: '61460dd554ea082ad025677d',
        toAccount: null,
      },
    },
    {
      id: '637e2389bda8050a85b1b760',
      amount: new Decimal(700),
      categoryId: '623b58ada3deba9879422fbf',
      createdAt: new Date('2024-05-10T10:21:18.365Z'),
      description: '',
      userId: '61460d7354ea082ad0256749',
      transactionId: '624bef946ba655edad8f7f3d',
      updatedAt: new Date('2024-05-10T10:21:18.365Z'),
      transaction: {
        date: new Date('2022-01-23T22:28:00.000Z'),
        fromAccount: null,
        toAccount: '61460de154ea082ad0256786',
      },
    },
    {
      id: '637e239cbda8050a85b1b7b8',
      amount: new Decimal(1571.53),
      categoryId: '623b58ada3deba9879422fbf',
      createdAt: new Date('2024-05-10T10:21:18.365Z'),
      description: '',
      userId: '61460d7354ea082ad0256749',
      transactionId: '624bef936ba655edad8f7f33',
      updatedAt: new Date('2024-05-10T10:21:18.365Z'),
      transaction: {
        date: new Date('2022-01-21T03:11:00.000Z'),
        fromAccount: null,
        toAccount: '61460db554ea082ad0256774',
      },
    },
  ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transactionCategoryMappingRepoFindAllByUserId: any[] = [
  {
    id: '637e234fbda8050a85b1b6b7',
    amount: new Decimal(500),
    categoryId: '623b58ada3deba9879422fbf',
    createdAt: new Date('2024-05-10T10:21:18.365Z'),
    description: '',
    userId: '61460d7354ea082ad0256749',
    transactionId: '624befb66ba655edad8f824e',
    updatedAt: new Date('2024-05-10T10:21:18.365Z'),
  },
  {
    id: '637e2371bda8050a85b1b70b',
    amount: new Decimal(635.98),
    categoryId: '623b58ada3deba9879422fbf',
    createdAt: new Date('2024-05-10T10:21:18.365Z'),
    description: '',
    userId: '61460d7354ea082ad0256749',
    transactionId: '624befb96ba655edad8f82ad',
    updatedAt: new Date('2024-05-10T10:21:18.365Z'),
  },
  {
    id: '637e2389bda8050a85b1b760',
    amount: new Decimal(700),
    categoryId: '623b58ada3deba9879422fbf',
    createdAt: new Date('2024-05-10T10:21:18.365Z'),
    description: '',
    userId: '61460d7354ea082ad0256749',
    transactionId: '624bef946ba655edad8f7f3d',
    updatedAt: new Date('2024-05-10T10:21:18.365Z'),
  },
  {
    id: '637e239cbda8050a85b1b7b8',
    amount: new Decimal(1571.53),
    categoryId: '623b58ada3deba9879422fbf',
    createdAt: new Date('2024-05-10T10:21:18.365Z'),
    description: '',
    userId: '61460d7354ea082ad0256749',
    transactionId: '624bef936ba655edad8f7f33',
    updatedAt: new Date('2024-05-10T10:21:18.365Z'),
  },
];
