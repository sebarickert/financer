import { AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AccountDto } from './account.dto';

import { UserId } from '@/types/user-id';

describe('AccountDto', () => {
  const userId = '700b48b9-2e9b-4f55-a79d-9a2d917416ce' as UserId;
  const now = new Date();

  const validAccount = {
    id: '413649f6-e095-474c-8f4c-e5d4e54654de',
    name: 'Test Account',
    type: AccountType.SAVINGS,
    balance: new Decimal(1000),
    currentDateBalance: new Decimal(1200),
    userId,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  };

  const plainValidAccount = {
    id: validAccount.id,
    name: validAccount.name,
    type: validAccount.type,
    balance: validAccount.balance.toString(),
    currentDateBalance: validAccount.currentDateBalance.toString(),
    userId: validAccount.userId,
    createdAt: validAccount.createdAt,
    updatedAt: validAccount.updatedAt,
    isDeleted: validAccount.isDeleted,
  };

  describe('constructor', () => {
    it('should create a valid AccountDto instance', () => {
      const dto = new AccountDto(validAccount);

      expect(dto).toBeDefined();
      expect(dto.id).toEqual(validAccount.id);
      expect(dto.name).toEqual(validAccount.name);
      expect(dto.type).toEqual(validAccount.type);
      expect(dto.balance).toEqual(validAccount.balance);
      expect(dto.currentDateBalance).toEqual(validAccount.currentDateBalance);
      expect(dto.userId).toEqual(validAccount.userId);
      expect(dto.createdAt).toEqual(validAccount.createdAt);
      expect(dto.updatedAt).toEqual(validAccount.updatedAt);
      expect(dto.isDeleted).toEqual(validAccount.isDeleted);
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(AccountDto, plainValidAccount);
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid id', async () => {
      const invalidDto = plainToInstance(AccountDto, {
        ...plainValidAccount,
        id: 'not-a-uuid',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with empty name', async () => {
      const invalidDto = plainToInstance(AccountDto, {
        ...plainValidAccount,
        name: '',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation with invalid type', async () => {
      const invalidDto = plainToInstance(AccountDto, {
        ...plainValidAccount,
        type: 'INVALID_TYPE',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('type');
    });

    it('should fail validation with invalid balance', async () => {
      const invalidDto = plainToInstance(AccountDto, {
        ...plainValidAccount,
        balance: 'not-a-decimal',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('balance');
    });

    it('should fail validation with invalid userId', async () => {
      const invalidDto = plainToInstance(AccountDto, {
        ...plainValidAccount,
        userId: 'not-a-uuid',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('userId');
    });
  });

  describe('createFromPlain', () => {
    it('should create a DTO from plain object', () => {
      const dto = AccountDto.createFromPlain({
        ...validAccount,
      });

      expect(dto).toBeInstanceOf(AccountDto);
      expect(dto.id).toEqual(plainValidAccount.id);
      expect(dto.name).toEqual(plainValidAccount.name);
      expect(dto.balance).toBeInstanceOf(Decimal);
      expect(dto.currentDateBalance).toBeInstanceOf(Decimal);
    });

    it('should create an array of DTOs from an array of plain objects', () => {
      const plainAccounts = [
        {
          ...validAccount,
        },
        {
          ...validAccount,
        },
      ];

      const dtos = AccountDto.createFromPlain(plainAccounts);

      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(AccountDto);
      expect(dtos[1]).toBeInstanceOf(AccountDto);
    });

    it('should handle null currentDateBalance', () => {
      const plainAccount = {
        ...validAccount,
        currentDateBalance: null,
      };

      const dto = AccountDto.createFromPlain(plainAccount);

      expect(dto.currentDateBalance).toBeNull();
    });
  });
});
