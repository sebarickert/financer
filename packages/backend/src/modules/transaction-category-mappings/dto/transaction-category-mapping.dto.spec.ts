import { TransactionCategoryMapping } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { TransactionCategoryMappingDto } from './transaction-category-mapping.dto';

import { UserId } from '@/types/user-id';

describe('TransactionCategoryMappingDto', () => {
  it('should create an empty instance', () => {
    const dto = new TransactionCategoryMappingDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const now = new Date();
    const mockMapping: TransactionCategoryMapping = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
      description: 'Grocery shopping',
      categoryId: '456e7890-f12c-45d6-e789-426614174888',
      transactionId: '789a1234-b56c-78d9-e012-426614174777',
      amount: new Decimal('42.50'),
      createdAt: now,
      updatedAt: now,
    };

    const dto = new TransactionCategoryMappingDto(mockMapping);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.userId).toEqual('987e6543-e21b-34d5-c678-426614174999');
    expect(dto.description).toEqual('Grocery shopping');
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.transactionId).toEqual('789a1234-b56c-78d9-e012-426614174777');
    expect(dto.amount).toEqual(new Decimal('42.50'));
    expect(dto.createdAt).toEqual(now);
    expect(dto.updatedAt).toEqual(now);
  });

  it('should create an instance with null description', () => {
    const mockMapping: TransactionCategoryMapping = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
      description: null,
      categoryId: '456e7890-f12c-45d6-e789-426614174888',
      transactionId: '789a1234-b56c-78d9-e012-426614174777',
      amount: new Decimal('42.50'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const dto = new TransactionCategoryMappingDto(mockMapping);

    expect(dto).toBeDefined();
    expect(dto.description).toBeNull();
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const mockMapping: TransactionCategoryMapping = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
        description: 'Grocery shopping',
        categoryId: '456e7890-f12c-45d6-e789-426614174888',
        transactionId: '789a1234-b56c-78d9-e012-426614174777',
        amount: new Decimal('42.50'),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = TransactionCategoryMappingDto.createFromPlain(mockMapping);
      expect(dto).toBeInstanceOf(TransactionCategoryMappingDto);
      expect(dto.description).toEqual('Grocery shopping');
      expect(dto.amount.toNumber()).toEqual(42.5);
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockMappings: TransactionCategoryMapping[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
          description: 'Grocery shopping',
          categoryId: '456e7890-f12c-45d6-e789-426614174888',
          transactionId: '789a1234-b56c-78d9-e012-426614174777',
          amount: new Decimal('42.50'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '234f5678-f90a-23e4-b567-426614174111',
          userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
          description: 'Restaurant bill',
          categoryId: '890b1234-c56d-67e8-f901-426614174222',
          transactionId: '123a4567-b89c-01d2-e345-426614174333',
          amount: new Decimal('78.90'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const dtos = TransactionCategoryMappingDto.createFromPlain(mockMappings);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionCategoryMappingDto);
      expect(dtos[1]).toBeInstanceOf(TransactionCategoryMappingDto);
      expect(dtos[0].description).toEqual('Grocery shopping');
      expect(dtos[1].description).toEqual('Restaurant bill');
      expect(dtos[0].amount.toNumber()).toEqual(42.5);
      expect(dtos[1].amount.toNumber()).toEqual(78.9);
    });
  });
});
