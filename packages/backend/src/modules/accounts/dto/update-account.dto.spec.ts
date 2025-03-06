import { AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateAccountDto } from './update-account.dto';

describe('UpdateAccountDto', () => {
  const validDto = {
    name: 'Updated Account',
    type: AccountType.INVESTMENT,
    balance: new Decimal(2000),
  };

  const plainValidDto = {
    name: validDto.name,
    type: validDto.type,
    balance: validDto.balance.toString(),
  };

  describe('constructor', () => {
    it('should create a valid DTO instance with all properties', () => {
      const dto = new UpdateAccountDto(validDto);

      expect(dto).toBeDefined();
      expect(dto.name).toEqual(validDto.name);
      expect(dto.type).toEqual(validDto.type);
      expect(dto.balance).toEqual(validDto.balance);
    });

    it('should create a valid DTO instance with partial properties', () => {
      const partialDto = new UpdateAccountDto({ name: 'Partial Update' });

      expect(partialDto).toBeDefined();
      expect(partialDto.name).toEqual('Partial Update');
      expect(partialDto.type).toBeUndefined();
      expect(partialDto.balance).toBeUndefined();
    });

    it('should create an empty DTO instance when no data is provided', () => {
      const dto = new UpdateAccountDto();

      expect(dto).toBeDefined();
      expect(dto.name).toBeUndefined();
      expect(dto.type).toBeUndefined();
      expect(dto.balance).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate a valid full DTO', async () => {
      const dto = plainToInstance(UpdateAccountDto, plainValidDto);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate a valid partial DTO', async () => {
      const dto = plainToInstance(UpdateAccountDto, { name: 'Partial Update' });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should validate an empty DTO', async () => {
      const dto = plainToInstance(UpdateAccountDto, {});
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty name', async () => {
      const invalidDto = plainToInstance(UpdateAccountDto, {
        name: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid type', async () => {
      const invalidDto = plainToInstance(UpdateAccountDto, {
        type: 'INVALID_TYPE',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('type');
    });
  });
});
