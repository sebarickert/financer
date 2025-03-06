import { Decimal } from '@prisma/client/runtime/library';
import { validate } from 'class-validator';

import { CreateExpenseDto } from './create-expense.dto';

describe('CreateExpenseDto', () => {
  const mockDate = new Date();

  it('should create an instance with provided properties', () => {
    const dto = new CreateExpenseDto({
      amount: new Decimal('250.00'),
      description: 'Grocery Shopping',
      date: mockDate,
      fromAccount: '234f5678-f90a-23e4-b567-426614174111',
      categories: [],
    });

    expect(dto).toBeDefined();
    expect(dto.amount).toEqual(new Decimal('250.00'));
    expect(dto.description).toEqual('Grocery Shopping');
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.categories).toEqual([]);
  });

  it('should validate that fromAccount is a UUID', async () => {
    const dto = new CreateExpenseDto({
      amount: new Decimal('250.00'),
      description: 'Invalid Expense',
      date: mockDate,
      fromAccount: 'invalid-uuid',
      categories: [],
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
