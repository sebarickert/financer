import { Decimal } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { AccountBalanceHistoryDto } from './account-balance-history.dto';

describe('AccountBalanceHistoryDto', () => {
  const now = new Date();

  const validBalanceHistory = {
    date: now,
    amount: new Decimal(100),
    balance: new Decimal(1000),
  };

  const plainValidBalanceHistory = {
    date: validBalanceHistory.date,
    amount: validBalanceHistory.amount.toString(),
    balance: validBalanceHistory.balance.toString(),
  };

  describe('constructor', () => {
    it('should create a valid AccountBalanceHistoryDto instance', () => {
      const dto = new AccountBalanceHistoryDto(validBalanceHistory);

      expect(dto).toBeDefined();
      expect(dto.date).toEqual(validBalanceHistory.date);
      expect(dto.amount).toEqual(validBalanceHistory.amount);
      expect(dto.balance).toEqual(validBalanceHistory.balance);
    });
  });

  describe('validation', () => {
    it('should validate a valid DTO', async () => {
      const dto = plainToInstance(
        AccountBalanceHistoryDto,
        plainValidBalanceHistory,
      );
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid date', async () => {
      const invalidDto = plainToInstance(AccountBalanceHistoryDto, {
        ...plainValidBalanceHistory,
        date: 'not-a-date',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('date');
    });

    it('should fail validation with invalid amount', async () => {
      const invalidDto = plainToInstance(AccountBalanceHistoryDto, {
        ...plainValidBalanceHistory,
        amount: 'not-a-decimal',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('amount');
    });

    it('should fail validation with invalid balance', async () => {
      const invalidDto = plainToInstance(AccountBalanceHistoryDto, {
        ...plainValidBalanceHistory,
        balance: 'not-a-decimal',
      });

      const errors = await validate(invalidDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('balance');
    });
  });

  describe('createFromPlain', () => {
    it('should create a DTO from plain object', () => {
      const dto = AccountBalanceHistoryDto.createFromPlain({
        date: validBalanceHistory.date,
        amount: validBalanceHistory.amount,
        balance: validBalanceHistory.balance,
      });

      expect(dto).toBeInstanceOf(AccountBalanceHistoryDto);
      expect(dto.date).toBeInstanceOf(Date);
      expect(dto.amount).toBeInstanceOf(Decimal);
      expect(dto.balance).toBeInstanceOf(Decimal);
    });

    it('should create an array of DTOs from an array of plain objects', () => {
      const plainBalanceHistories = [
        {
          date: validBalanceHistory.date,
          amount: validBalanceHistory.amount,
          balance: validBalanceHistory.balance,
        },
        {
          date: validBalanceHistory.date,
          amount: validBalanceHistory.amount,
          balance: validBalanceHistory.balance,
        },
      ];

      const dtos = AccountBalanceHistoryDto.createFromPlain(
        plainBalanceHistories,
      );

      expect(dtos).toBeInstanceOf(Array);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(AccountBalanceHistoryDto);
      expect(dtos[1]).toBeInstanceOf(AccountBalanceHistoryDto);
    });
  });
});
