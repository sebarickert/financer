import { AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateAccountDto } from './create-account.dto';

describe('CreateAccountDto', () => {
  const validDto = {
    name: 'Test Account',
    type: AccountType.SAVINGS,
    balance: new Decimal(1000),
  };

  const plainValidDto = {
    name: validDto.name,
    type: validDto.type,
    balance: validDto.balance.toString(),
  };

  describe('constructor', () => {
    it('should create a valid DTO instance', () => {
      const dto = new CreateAccountDto(validDto);

      expect(dto).toBeDefined();
      expect(dto.name).toEqual(validDto.name);
      expect(dto.type).toEqual(validDto.type);
      expect(dto.balance).toEqual(validDto.balance);
    });

    it('should create an empty DTO instance when no data is provided', () => {
      const dto = new CreateAccountDto();

      expect(dto).toBeDefined();
      expect(dto.name).toBeUndefined();
      expect(dto.type).toBeUndefined();
      expect(dto.balance).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(CreateAccountDto, plainValidDto);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const invalidDto = plainToInstance(CreateAccountDto, {
        ...plainValidDto,
        name: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid type', async () => {
      const invalidDto = plainToInstance(CreateAccountDto, {
        ...plainValidDto,
        type: 'INVALID_TYPE',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('type');
    });

    it('should fail validation with invalid balance', async () => {
      const invalidDto = plainToInstance(CreateAccountDto, {
        ...plainValidDto,
        balance: 'not-a-decimal',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('balance');
    });
  });
});
