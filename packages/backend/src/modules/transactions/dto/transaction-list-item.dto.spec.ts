import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { instanceToPlain } from 'class-transformer';

import { TransactionListItemCategoryDto } from './transaction-list-item-category.dto';
import { TransactionListItemDto } from './transaction-list-item.dto';

describe('TransactionListItemDto', () => {
  const mockDate = new Date();

  const mockCategory: TransactionListItemCategoryDto = {
    id: '456e7890-f12c-45d6-e789-426614174888',
    name: 'Housing',
  };

  const mockListItem = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('1250.00'),
    description: 'Monthly Rent',
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    toAccount: null,
    isRecurring: true,
    categories: [mockCategory],
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransactionListItemDto(mockListItem);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('1250.00'));
    expect(dto.description).toEqual('Monthly Rent');
    expect(dto.date).toEqual(mockDate);
    expect(dto.isRecurring).toBeTruthy();
    expect(dto.categories).toHaveLength(1);
    expect(dto.categories[0].name).toEqual('Housing');
  });

  it('should compute correct transaction type for expense', () => {
    const dto = new TransactionListItemDto(mockListItem);
    const plain = instanceToPlain(dto);
    expect(plain.type).toEqual(TransactionType.EXPENSE);
  });

  it('should compute correct transaction type for income', () => {
    const incomeItem = {
      ...mockListItem,
      fromAccount: null,
      toAccount: '234f5678-f90a-23e4-b567-426614174111',
    };
    const dto = new TransactionListItemDto(incomeItem);
    const plain = instanceToPlain(dto);
    expect(plain.type).toEqual(TransactionType.INCOME);
  });

  it('should compute correct transaction type for transfer', () => {
    const transferItem = {
      ...mockListItem,
      toAccount: '345g6789-h01i-67j8-k901-426614174222',
    };
    const dto = new TransactionListItemDto(transferItem);
    const plain = instanceToPlain(dto);
    expect(plain.type).toEqual(TransactionType.TRANSFER);
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const dto = TransactionListItemDto.createFromPlain(mockListItem);

      expect(dto).toBeInstanceOf(TransactionListItemDto);
      expect(dto.description).toEqual('Monthly Rent');
      expect(dto.categories).toHaveLength(1);
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockItems = [
        mockListItem,
        {
          ...mockListItem,
          id: '234f5678-f90a-23e4-b567-426614174111',
          description: 'Grocery Shopping',
          amount: new Decimal('85.50'),
          isRecurring: false,
        },
      ];

      const dtos = TransactionListItemDto.createFromPlain(mockItems);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionListItemDto);
      expect(dtos[1]).toBeInstanceOf(TransactionListItemDto);
      expect(dtos[0].description).toEqual('Monthly Rent');
      expect(dtos[1].description).toEqual('Grocery Shopping');
      expect(dtos[0].isRecurring).toBeTruthy();
      expect(dtos[1].isRecurring).toBeFalsy();
    });
  });
});
