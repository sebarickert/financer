import { Decimal } from '@prisma/client/runtime/library';

import { TransactionMonthSummaryDto } from './transaction-month-summary.dto';

describe('TransactionMonthSummaryDto', () => {
  const mockMonthSummary = {
    id: { year: 2023, month: 9 },
    totalCount: 15,
    incomesCount: 3,
    expensesCount: 10,
    transfersCount: 2,
    totalAmount: new Decimal('3500.00'),
    incomeAmount: new Decimal('2500.00'),
    expenseAmount: new Decimal('800.00'),
    transferAmount: new Decimal('200.00'),
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransactionMonthSummaryDto(mockMonthSummary);

    expect(dto).toBeDefined();
    expect(dto.id.year).toEqual(2023);
    expect(dto.id.month).toEqual(9);
    expect(dto.totalCount).toEqual(15);
    expect(dto.incomesCount).toEqual(3);
    expect(dto.expensesCount).toEqual(10);
    expect(dto.transfersCount).toEqual(2);
    expect(dto.totalAmount).toEqual(new Decimal('3500.00'));
    expect(dto.incomeAmount).toEqual(new Decimal('2500.00'));
    expect(dto.expenseAmount).toEqual(new Decimal('800.00'));
    expect(dto.transferAmount).toEqual(new Decimal('200.00'));
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const dto = TransactionMonthSummaryDto.createFromPlain(mockMonthSummary);

      expect(dto).toBeInstanceOf(TransactionMonthSummaryDto);
      expect(dto.id.year).toEqual(2023);
      expect(dto.id.month).toEqual(9);
      expect(dto.totalAmount).toEqual(new Decimal('3500.00'));
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockSummaries = [
        mockMonthSummary,
        {
          ...mockMonthSummary,
          id: { year: 2023, month: 10 },
          totalAmount: new Decimal('4200.00'),
          expenseAmount: new Decimal('1200.00'),
        },
      ];

      const dtos = TransactionMonthSummaryDto.createFromPlain(mockSummaries);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionMonthSummaryDto);
      expect(dtos[1]).toBeInstanceOf(TransactionMonthSummaryDto);
      expect(dtos[0].id.month).toEqual(9);
      expect(dtos[1].id.month).toEqual(10);
      expect(dtos[0].totalAmount).toEqual(new Decimal('3500.00'));
      expect(dtos[1].totalAmount).toEqual(new Decimal('4200.00'));
    });

    it('should handle string amounts conversion', () => {
      const plainObject = {
        ...mockMonthSummary,
        totalAmount: '3500.00',
        incomeAmount: '2500.00',
        expenseAmount: '800.00',
        transferAmount: '200.00',
      };

      // @ts-expect-error - Testing with string amounts instead of Decimal
      const dto = TransactionMonthSummaryDto.createFromPlain(plainObject);

      expect(dto).toBeInstanceOf(TransactionMonthSummaryDto);
      expect(dto.totalAmount).toBeInstanceOf(Decimal);
      expect(dto.totalAmount.toString()).toEqual('3500');
      expect(dto.incomeAmount.toString()).toEqual('2500');
    });
  });
});
