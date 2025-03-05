import { Decimal } from '@prisma/client/runtime/library';
import { validate } from 'class-validator';

import { CreateIncomeDto } from './create-income.dto';

describe('CreateIncomeDto', () => {
  const mockDate = new Date();

  it('should create an instance with provided properties', () => {
    const dto = new CreateIncomeDto({
      amount: new Decimal('250.00'),
      description: 'Salary Payment',
      date: mockDate,
      toAccount: '234f5678-f90a-23e4-b567-426614174111',
      categories: [],
    });

    expect(dto).toBeDefined();
    expect(dto.amount).toEqual(new Decimal('250.00'));
    expect(dto.description).toEqual('Salary Payment');
    expect(dto.date).toEqual(mockDate);
    expect(dto.toAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.categories).toEqual([]);
  });

  it('should validate that toAccount is a UUID', async () => {
    const dto = new CreateIncomeDto({
      amount: new Decimal('250.00'),
      description: 'Invalid Income',
      date: mockDate,
      toAccount: 'invalid-uuid',
      categories: [],
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
