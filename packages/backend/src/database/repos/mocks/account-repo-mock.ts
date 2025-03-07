import { Account } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { AccountDto } from '@/modules/accounts/dto/account.dto';
import { UserId } from '@/types/user-id';

export const accountsRepoFindAllMockData: AccountDto[] = [
  // @ts-expect-error - needs some work
  {
    id: '61460d8554ea082ad0256759',
    balance: new Decimal(5728.67),
    createdAt: new Date('2024-05-10T10:21:18.333Z'),
    isDeleted: false,
    name: 'Saving account 1',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'SAVINGS',
    updatedAt: new Date('2024-05-10T10:21:18.333Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '61460d9454ea082ad0256762',
    balance: new Decimal(56323.6),
    createdAt: new Date('2024-05-10T10:21:18.333Z'),
    isDeleted: false,
    name: 'Saving account 2',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'SAVINGS',
    updatedAt: new Date('2024-05-10T10:21:18.333Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '61460da354ea082ad025676b',
    balance: new Decimal(11201.26),
    createdAt: new Date('2024-05-10T10:21:18.333Z'),
    isDeleted: false,
    name: 'Cash account',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'CASH',
    updatedAt: new Date('2024-05-10T10:21:18.333Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '61460db554ea082ad0256774',
    balance: new Decimal(-2901.87),
    createdAt: new Date('2024-05-10T10:21:18.333Z'),
    isDeleted: false,
    name: 'Investment account',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'INVESTMENT',
    updatedAt: new Date('2024-05-10T10:21:18.333Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '61460dd554ea082ad025677d',
    balance: new Decimal(3509.96),
    createdAt: new Date('2024-05-10T10:21:18.333Z'),
    isDeleted: false,
    name: 'Credit account',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'CREDIT',
    updatedAt: new Date('2024-05-10T10:21:18.333Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '61460de154ea082ad0256786',
    balance: new Decimal(-6716.63),
    createdAt: new Date('2024-05-10T10:21:18.333Z'),
    isDeleted: false,
    name: 'Loan account',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'LOAN',
    updatedAt: new Date('2024-05-10T10:21:18.333Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '663df55ad8ef53dcb2bc9347',
    balance: new Decimal(12400),
    createdAt: new Date('2024-05-10T10:22:18.423Z'),
    isDeleted: false,
    name: 'Big money',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'SAVINGS',
    updatedAt: new Date('2024-05-10T10:28:36.672Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '663df623d8ef53dcb2bc93c0',
    balance: new Decimal(21100),
    createdAt: new Date('2024-05-10T10:25:39.733Z'),
    isDeleted: false,
    name: 'Long-term SAVINGS',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'LONG_TERM_SAVINGS',
    updatedAt: new Date('2024-05-10T10:28:36.670Z'),
  },
  // @ts-expect-error - needs some work
  {
    id: '663df62cd8ef53dcb2bc93c4',
    balance: new Decimal(14000),
    createdAt: new Date('2024-05-10T10:25:48.973Z'),
    isDeleted: false,
    name: 'Pre-assigned CASH',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'PRE_ASSIGNED_CASH',
    updatedAt: new Date('2024-05-10T10:27:05.349Z'),
  },
];

export const accountsRepoFindById: Record<string, Account> = {
  '61460d8554ea082ad0256759': {
    id: '61460d8554ea082ad0256759',
    balance: new Decimal(5728.67),
    createdAt: new Date('2024-05-10T10:21:18.333Z'),
    isDeleted: false,
    name: 'Saving account 1',
    userId: '61460d7354ea082ad0256749' as UserId,
    type: 'SAVINGS',
    updatedAt: new Date('2024-05-10T10:21:18.333Z'),
  },
};
