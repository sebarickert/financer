import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { ExpenseDetailsDto } from './expense-details.dto';

import { UserId } from '@/types/user-id';

describe('ExpenseDetailsDto', () => {
  const mockDate = new Date();

  const mockExpense = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('250.00'),
    description: 'Grocery Shopping',
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    userId: '22d0ba03-19e0-4e4c-a6b2-3c0e14cd05bb' as UserId,
    fromAccountName: 'From account name',
    isRecurring: false,
    type: TransactionType.EXPENSE,
    categories: [],
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create an instance with provided properties', () => {
    const dto = new ExpenseDetailsDto(mockExpense);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('250.00'));
    expect(dto.description).toEqual('Grocery Shopping');
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.userId).toEqual('22d0ba03-19e0-4e4c-a6b2-3c0e14cd05bb');
    expect(dto.fromAccountName).toEqual('From account name');
    expect(dto.isRecurring).toEqual(false);
    expect(dto.categories).toEqual([]);
    expect(dto.createdAt).toEqual(mockDate);
    expect(dto.updatedAt).toEqual(mockDate);
  });
});
