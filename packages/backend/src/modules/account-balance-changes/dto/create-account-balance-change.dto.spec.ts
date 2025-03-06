import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateAccountBalanceChangeDto } from './create-account-balance-change.dto';

describe('CreateAccountBalanceChangeDto', () => {
  const validDto = {
    date: new Date(),
    amount: new Decimal(1000),
    accountId: '82f99cad-1444-4c51-9d3d-cac3173bf13c',
  };

  const plainValidDto = {
    date: validDto.date,
    amount: validDto.amount.toString(),
    accountId: validDto.accountId,
  };

  it('should create a valid DTO instance', () => {
    const dto = new CreateAccountBalanceChangeDto(validDto);

    expect(dto).toBeDefined();
    expect(dto.date).toEqual(validDto.date);
    expect(dto.amount).toEqual(validDto.amount);
    expect(dto.accountId).toEqual(validDto.accountId);
  });

  it('should validate a valid DTO', async () => {
    const dto = plainToInstance(CreateAccountBalanceChangeDto, plainValidDto);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid date', async () => {
    const invalidDto = plainToInstance(CreateAccountBalanceChangeDto, {
      ...plainValidDto,
      date: 'not-a-date',
    });

    const errors = await validate(invalidDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('date');
  });

  it('should fail validation with invalid amount', async () => {
    const invalidDto = plainToInstance(CreateAccountBalanceChangeDto, {
      ...plainValidDto,
      amount: 'not-a-decimal',
    });

    const errors = await validate(invalidDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('amount');
  });

  it('should fail validation with invalid accountId', async () => {
    const invalidDto = plainToInstance(CreateAccountBalanceChangeDto, {
      ...plainValidDto,
      accountId: 'not-a-uuid',
    });

    const errors = await validate(invalidDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('accountId');
  });
});
