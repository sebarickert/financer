import { Decimal } from '@prisma/client/runtime/library';

import { TransactionSummaryDto } from './transaction-summary.dto';

describe('TransactionSummaryDto', () => {
  const mockDate = new Date();

  const mockTransaction = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('1250.00'),
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    toAccount: null,
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransactionSummaryDto(mockTransaction);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('1250.00'));
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.toAccount).toBeNull();
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const dto = TransactionSummaryDto.createFromPlain(mockTransaction);

      expect(dto).toBeInstanceOf(TransactionSummaryDto);
      expect(dto.amount).toEqual(new Decimal('1250.00'));
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockTransactions = [
        mockTransaction,
        {
          ...mockTransaction,
          id: '234f5678-f90a-23e4-b567-426614174111',
          amount: new Decimal('85.50'),
        },
      ];

      const dtos = TransactionSummaryDto.createFromPlain(mockTransactions);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionSummaryDto);
      expect(dtos[1]).toBeInstanceOf(TransactionSummaryDto);
      expect(dtos[0].amount).toEqual(new Decimal('1250.00'));
      expect(dtos[1].amount).toEqual(new Decimal('85.50'));
    });

    it('should handle string amount and date conversion', () => {
      const plainObject = {
        ...mockTransaction,
        amount: '1250.00',
        date: mockDate.toISOString(),
      };

      // @ts-expect-error - Testing with string amount instead of Decimal
      const dto = TransactionSummaryDto.createFromPlain(plainObject);

      expect(dto).toBeInstanceOf(TransactionSummaryDto);
      expect(dto.amount).toBeInstanceOf(Decimal);
      expect(dto.amount.toString()).toEqual('1250');
      expect(dto.date).toBeInstanceOf(Date);
    });
  });
});
