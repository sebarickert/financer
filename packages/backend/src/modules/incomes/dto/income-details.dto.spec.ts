import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { IncomeDetailsDto } from './income-details.dto';

import { UserId } from '@/types/user-id';

describe('IncomeDetailsDto', () => {
  const mockDate = new Date();

  const mockIncome = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('250.00'),
    description: 'Salary Payment',
    date: mockDate,
    toAccount: '234f5678-f90a-23e4-b567-426614174111',
    userId: '22d0ba03-19e0-4e4c-a6b2-3c0e14cd05bb' as UserId,
    toAccountName: 'To account name',
    isRecurring: false,
    type: TransactionType.INCOME,
    categories: [],
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create an instance with provided properties', () => {
    const dto = new IncomeDetailsDto(mockIncome);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('250.00'));
    expect(dto.description).toEqual('Salary Payment');
    expect(dto.date).toEqual(mockDate);
    expect(dto.toAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.userId).toEqual('22d0ba03-19e0-4e4c-a6b2-3c0e14cd05bb');
    expect(dto.toAccountName).toEqual('To account name');
    expect(dto.isRecurring).toEqual(false);
    expect(dto.categories).toEqual([]);
    expect(dto.createdAt).toEqual(mockDate);
    expect(dto.updatedAt).toEqual(mockDate);
  });
});
