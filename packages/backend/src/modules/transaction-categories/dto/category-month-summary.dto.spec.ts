import { Decimal } from '@prisma/client/runtime/library';

import { CategoryMonthlySummaryDto } from './category-month-summary.dto';

describe('CategoryMonthlySummaryDto', () => {
  it('should create an empty instance', () => {
    const dto = new CategoryMonthlySummaryDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const dto = new CategoryMonthlySummaryDto({
      id: { year: 2023, month: 5 },
      totalCount: 10,
      incomesCount: 3,
      expensesCount: 7,
      transfersCount: 0,
      totalAmount: new Decimal(1500.75),
      incomeAmount: new Decimal(2000),
      expenseAmount: new Decimal(499.25),
      transferAmount: new Decimal(0),
    });

    expect(dto).toBeDefined();
    expect(dto.id.year).toEqual(2023);
    expect(dto.id.month).toEqual(5);
    expect(dto.totalCount).toEqual(10);
    expect(dto.incomesCount).toEqual(3);
    expect(dto.expensesCount).toEqual(7);
    expect(dto.transfersCount).toEqual(0);
    expect(dto.totalAmount).toEqual(new Decimal(1500.75));
    expect(dto.incomeAmount).toEqual(new Decimal(2000));
    expect(dto.expenseAmount).toEqual(new Decimal(499.25));
    expect(dto.transferAmount).toEqual(new Decimal(0));
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const plainObj = {
        id: { year: 2023, month: 5 },
        totalCount: 10,
        incomesCount: 3,
        expensesCount: 7,
        transfersCount: 0,
        totalAmount: new Decimal(1500.75),
        incomeAmount: new Decimal(2000),
        expenseAmount: new Decimal(499.25),
        transferAmount: new Decimal(0),
      };

      const dto = CategoryMonthlySummaryDto.createFromPlain(plainObj);
      expect(dto).toBeInstanceOf(CategoryMonthlySummaryDto);
      expect(dto.id.year).toEqual(2023);
      expect(dto.id.month).toEqual(5);
      expect(dto.totalCount).toEqual(10);
    });

    it('should create DTOs from an array of plain objects', () => {
      const plainObjs = [
        {
          id: { year: 2023, month: 5 },
          totalCount: 10,
          incomesCount: 3,
          expensesCount: 7,
          transfersCount: 0,
          totalAmount: new Decimal(1500.75),
          incomeAmount: new Decimal(2000),
          expenseAmount: new Decimal(499.25),
          transferAmount: new Decimal(0),
        },
        {
          id: { year: 2023, month: 6 },
          totalCount: 12,
          incomesCount: 4,
          expensesCount: 8,
          transfersCount: 0,
          totalAmount: new Decimal(1600.5),
          incomeAmount: new Decimal(2100),
          expenseAmount: new Decimal(499.5),
          transferAmount: new Decimal(0),
        },
      ];

      const dtos = CategoryMonthlySummaryDto.createFromPlain(plainObjs);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(CategoryMonthlySummaryDto);
      expect(dtos[1]).toBeInstanceOf(CategoryMonthlySummaryDto);
      expect(dtos[0].id.month).toEqual(5);
      expect(dtos[1].id.month).toEqual(6);
    });
  });
});
