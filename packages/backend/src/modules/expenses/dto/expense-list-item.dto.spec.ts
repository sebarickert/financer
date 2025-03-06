import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { ExpenseListItemDto } from './expense-list-item.dto';

describe('ExpenseListItemDto', () => {
  const mockDate = new Date();

  const mockExpense = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('250.00'),
    description: 'Grocery Shopping',
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    isRecurring: false,
    type: TransactionType.EXPENSE,
    categories: [],
  };

  it('should create an instance with provided properties', () => {
    const dto = new ExpenseListItemDto(mockExpense);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('250.00'));
    expect(dto.description).toEqual('Grocery Shopping');
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.isRecurring).toEqual(false);
    expect(dto.categories).toEqual([]);
  });
});
