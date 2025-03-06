import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { instanceToPlain } from 'class-transformer';

import { TransactionDetailCategoryDto } from './transaction-detail-category.dto';
import { TransactionDetailsDto } from './transaction-details.dto';
import { TransactionDto } from './transaction.dto';

import { UserId } from '@/types/user-id';

describe('TransactionDetailsDto', () => {
  const mockDate = new Date();

  const mockCategory: TransactionDetailCategoryDto = {
    id: '456e7890-f12c-45d6-e789-426614174888',
    description: 'Housing expenses',
    amount: new Decimal('1250.00'),
    name: 'Housing',
    path: 'Expenses/Housing',
  };

  const mockDetails = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
    amount: new Decimal('1250.00'),
    description: 'Monthly Rent',
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    toAccount: null,
    createdAt: mockDate,
    updatedAt: mockDate,
    fromAccountName: 'Main Checking Account',
    toAccountName: null,
    isRecurring: true,
    categories: [mockCategory],
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransactionDetailsDto(mockDetails);

    expect(dto).toBeDefined();
    expect(dto).toBeInstanceOf(TransactionDto);
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.fromAccountName).toEqual('Main Checking Account');
    expect(dto.toAccountName).toBeNull();
    expect(dto.isRecurring).toBeTruthy();
    expect(dto.categories).toHaveLength(1);
    expect(dto.categories[0].name).toEqual('Housing');
  });

  it('should compute correct transaction type for expense', () => {
    const dto = new TransactionDetailsDto(mockDetails);
    const plain = instanceToPlain(dto);
    expect(plain.type).toEqual(TransactionType.EXPENSE);
  });

  it('should compute correct transaction type for income', () => {
    const incomeDetails = {
      ...mockDetails,
      fromAccount: null,
      toAccount: '234f5678-f90a-23e4-b567-426614174111',
      fromAccountName: null,
      toAccountName: 'Main Checking Account',
    };
    const dto = new TransactionDetailsDto(incomeDetails);
    const plain = instanceToPlain(dto);
    expect(plain.type).toEqual(TransactionType.INCOME);
  });

  it('should compute correct transaction type for transfer', () => {
    const transferDetails = {
      ...mockDetails,
      toAccount: '345g6789-h01i-67j8-k901-426614174222',
      toAccountName: 'Savings Account',
    };
    const dto = new TransactionDetailsDto(transferDetails);
    const plain = instanceToPlain(dto);
    expect(plain.type).toEqual(TransactionType.TRANSFER);
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const dto = TransactionDetailsDto.createFromPlain(mockDetails);

      expect(dto).toBeInstanceOf(TransactionDetailsDto);
      expect(dto.description).toEqual('Monthly Rent');
      expect(dto.fromAccountName).toEqual('Main Checking Account');
      expect(dto.categories).toHaveLength(1);
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockDetailsArray = [
        mockDetails,
        {
          ...mockDetails,
          id: '234f5678-f90a-23e4-b567-426614174111',
          description: 'Grocery Shopping',
          amount: new Decimal('85.50'),
          isRecurring: false,
        },
      ];

      const dtos = TransactionDetailsDto.createFromPlain(mockDetailsArray);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionDetailsDto);
      expect(dtos[1]).toBeInstanceOf(TransactionDetailsDto);
      expect(dtos[0].description).toEqual('Monthly Rent');
      expect(dtos[1].description).toEqual('Grocery Shopping');
      expect(dtos[0].isRecurring).toBeTruthy();
      expect(dtos[1].isRecurring).toBeFalsy();
    });
  });
});
