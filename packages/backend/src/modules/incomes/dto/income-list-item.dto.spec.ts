import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { IncomeListItemDto } from './income-list-item.dto';

describe('IncomeListItemDto', () => {
  const mockDate = new Date();

  const mockIncome = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('250.00'),
    description: 'Salary Payment',
    date: mockDate,
    toAccount: '234f5678-f90a-23e4-b567-426614174111',
    isRecurring: false,
    type: TransactionType.INCOME,
    categories: [],
  };

  it('should create an instance with provided properties', () => {
    const dto = new IncomeListItemDto(mockIncome);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('250.00'));
    expect(dto.description).toEqual('Salary Payment');
    expect(dto.date).toEqual(mockDate);
    expect(dto.toAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.isRecurring).toEqual(false);
    expect(dto.categories).toEqual([]);
  });
});
