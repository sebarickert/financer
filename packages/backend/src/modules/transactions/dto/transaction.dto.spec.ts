import { Decimal } from '@prisma/client/runtime/library';

import { TransactionDto } from './transaction.dto';

import { UserId } from '@/types/user-id';

describe('TransactionDto', () => {
  const mockDate = new Date();

  const mockTransaction = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
    amount: new Decimal('1250.00'),
    description: 'Monthly Rent',
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    toAccount: null,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransactionDto(mockTransaction);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.userId).toEqual('987e6543-e21b-34d5-c678-426614174999');
    expect(dto.amount).toEqual(new Decimal('1250.00'));
    expect(dto.description).toEqual('Monthly Rent');
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.toAccount).toBeNull();
    expect(dto.createdAt).toEqual(mockDate);
    expect(dto.updatedAt).toEqual(mockDate);
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const dto = TransactionDto.createFromPlain(mockTransaction);

      expect(dto).toBeInstanceOf(TransactionDto);
      expect(dto.description).toEqual('Monthly Rent');
      expect(dto.amount).toEqual(new Decimal('1250.00'));
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockTransactions = [
        mockTransaction,
        {
          ...mockTransaction,
          id: '234f5678-f90a-23e4-b567-426614174111',
          description: 'Grocery Shopping',
          amount: new Decimal('85.50'),
        },
      ];

      const dtos = TransactionDto.createFromPlain(mockTransactions);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionDto);
      expect(dtos[1]).toBeInstanceOf(TransactionDto);
      expect(dtos[0].description).toEqual('Monthly Rent');
      expect(dtos[1].description).toEqual('Grocery Shopping');
    });

    it('should handle string amount and date conversion', () => {
      const plainObject = {
        ...mockTransaction,
        amount: '1250.00',
        date: mockDate.toISOString(),
      };

      // @ts-expect-error - Testing with string amount instead of Decimal
      const dto = TransactionDto.createFromPlain(plainObject);

      expect(dto).toBeInstanceOf(TransactionDto);
      expect(dto.amount).toBeInstanceOf(Decimal);
      expect(dto.amount.toString()).toEqual('1250');
      expect(dto.date).toBeInstanceOf(Date);
    });
  });
});
