import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AccountBalanceChangeDto } from './account-balance-change.dto';

import { UserId } from '@/types/user-id';

describe('AccountBalanceChangeDto', () => {
  const now = new Date();
  const userId = '700b48b9-2e9b-4f55-a79d-9a2d917416ce' as UserId;

  const validAccountBalanceChange = {
    id: '413649f6-e095-474c-8f4c-e5d4e54654de',
    date: now,
    amount: new Decimal(500),
    userId,
    accountId: 'eed3f48b-04d4-453a-8a14-80f8fed12e31',
    createdAt: now,
    updatedAt: now,
  };

  const plainValidBalanceChange = {
    id: validAccountBalanceChange.id,
    date: validAccountBalanceChange.date,
    amount: validAccountBalanceChange.amount.toString(),
    userId: validAccountBalanceChange.userId,
    accountId: validAccountBalanceChange.accountId,
    createdAt: validAccountBalanceChange.createdAt,
    updatedAt: validAccountBalanceChange.updatedAt,
  };

  describe('constructor', () => {
    it('should create a valid AccountBalanceChangeDto instance', () => {
      const dto = new AccountBalanceChangeDto(validAccountBalanceChange);

      expect(dto).toBeDefined();
      expect(dto.id).toEqual(validAccountBalanceChange.id);
      expect(dto.date).toEqual(validAccountBalanceChange.date);
      expect(dto.amount).toEqual(validAccountBalanceChange.amount);
      expect(dto.userId).toEqual(validAccountBalanceChange.userId);
      expect(dto.accountId).toEqual(validAccountBalanceChange.accountId);
      expect(dto.createdAt).toEqual(validAccountBalanceChange.createdAt);
      expect(dto.updatedAt).toEqual(validAccountBalanceChange.updatedAt);
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(
        AccountBalanceChangeDto,
        plainValidBalanceChange,
      );
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid id', async () => {
      const invalidDto = plainToInstance(AccountBalanceChangeDto, {
        ...plainValidBalanceChange,
        id: 'not-a-uuid',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation with invalid date', async () => {
      const invalidDto = plainToInstance(AccountBalanceChangeDto, {
        ...plainValidBalanceChange,
        date: 'not-a-date',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('date');
    });

    it('should fail validation with invalid amount', async () => {
      const invalidDto = plainToInstance(AccountBalanceChangeDto, {
        ...plainValidBalanceChange,
        amount: 'not-a-decimal',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('amount');
    });

    it('should fail validation with invalid userId', async () => {
      const invalidDto = plainToInstance(AccountBalanceChangeDto, {
        ...plainValidBalanceChange,
        userId: 'not-a-uuid',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with invalid accountId', async () => {
      const invalidDto = plainToInstance(AccountBalanceChangeDto, {
        ...plainValidBalanceChange,
        accountId: 'not-a-uuid',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('accountId');
    });
  });

  describe('createFromPlain', () => {
    it('should create a DTO from plain object', () => {
      const dto = AccountBalanceChangeDto.createFromPlain(
        validAccountBalanceChange,
      );

      expect(dto).toBeInstanceOf(AccountBalanceChangeDto);
      expect(dto.id).toEqual(validAccountBalanceChange.id);
      expect(dto.amount).toEqual(validAccountBalanceChange.amount);
    });

    it('should create an array of DTOs from an array of plain objects', () => {
      const dtos = AccountBalanceChangeDto.createFromPlain([
        validAccountBalanceChange,
        validAccountBalanceChange,
      ]);

      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(AccountBalanceChangeDto);
      expect(dtos[1]).toBeInstanceOf(AccountBalanceChangeDto);
    });
  });
});
