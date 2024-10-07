import { TransactionTemplate } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export const transactionTemplateAllByUserRepoMockData: TransactionTemplate[] = [
  {
    id: '638da86a4ce377d764461255',
    amount: new Decimal(200),
    categories: [],
    createdAt: new Date('2024-10-08T18:46:13.043Z'),
    dayOfMonth: 31,
    dayOfMonthToCreate: 2,
    description: 'Test template 2',
    fromAccount: null,
    templateName: 'Test template 2',
    templateType: ['AUTO'],
    templateVisibility: 'INCOME',
    toAccount: '61460da354ea082ad025676b',
    updatedAt: new Date('2024-10-08T18:46:13.043Z'),
    userId: '61460d7354ea082ad0256749',
  },
];
