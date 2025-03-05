import { Decimal } from '@prisma/client/runtime/library';
import { validate } from 'class-validator';

import { CreateTransferDto } from './create-transfer.dto';

describe('CreateTransferDto', () => {
  const mockDate = new Date();

  it('should create an instance with provided properties', () => {
    const dto = new CreateTransferDto({
      amount: new Decimal('1250.00'),
      description: 'Fund Transfer',
      date: mockDate,
      fromAccount: '234f5678-f90a-23e4-b567-426614174111',
      toAccount: '345g6789-g01b-34f5-c678-426614174222',
      categories: [],
    });

    expect(dto).toBeDefined();
    expect(dto.amount).toEqual(new Decimal('1250.00'));
    expect(dto.description).toEqual('Fund Transfer');
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.toAccount).toEqual('345g6789-g01b-34f5-c678-426614174222');
    expect(dto.categories).toEqual([]);
  });

  it.skip('should validate that fromAccount and toAccount are different', async () => {
    const dto = new CreateTransferDto({
      amount: new Decimal('1250.00'),
      description: 'Invalid Transfer',
      date: mockDate,
      fromAccount: '234f5678-f90a-23e4-b567-426614174111',
      toAccount: '234f5678-f90a-23e4-b567-426614174111', // Same as fromAccount
      categories: [],
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEqual');
    expect(errors[0].constraints?.isNotEqual).toContain(
      "can't be the same account",
    );
  });

  it('should validate that toAccount is a UUID', async () => {
    const dto = new CreateTransferDto({
      amount: new Decimal('1250.00'),
      description: 'Invalid Transfer',
      date: mockDate,
      fromAccount: '234f5678-f90a-23e4-b567-426614174111',
      toAccount: 'invalid-uuid',
      categories: [],
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });

  it('should validate that fromAccount is a UUID', async () => {
    const dto = new CreateTransferDto({
      amount: new Decimal('1250.00'),
      description: 'Invalid Transfer',
      date: mockDate,
      fromAccount: 'invalid-uuid',
      toAccount: '345g6789-g01b-34f5-c678-426614174222',
      categories: [],
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isUuid');
  });
});
