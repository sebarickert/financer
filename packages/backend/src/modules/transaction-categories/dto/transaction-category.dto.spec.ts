import { TransactionType } from '@prisma/client';

import { TransactionCategoryDto } from './transaction-category.dto';

import { UserId } from '@/types/user-id';

describe('TransactionCategoryDto', () => {
  it('should create an empty instance', () => {
    const dto = new TransactionCategoryDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const now = new Date();
    const dto = new TransactionCategoryDto({
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
      name: 'Groceries',
      visibility: [TransactionType.EXPENSE],
      deleted: false,
      parentCategoryId: null,
      createdAt: now,
      updatedAt: now,
    });

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.userId).toEqual('987e6543-e21b-34d5-c678-426614174999');
    expect(dto.name).toEqual('Groceries');
    expect(dto.visibility).toEqual([TransactionType.EXPENSE]);
    expect(dto.deleted).toBeFalsy();
    expect(dto.parentCategoryId).toBeNull();
    expect(dto.createdAt).toEqual(now);
    expect(dto.updatedAt).toEqual(now);
  });

  it('should create an instance with a parent category', () => {
    const dto = new TransactionCategoryDto({
      id: '123e4567-e89b-12d3-a456-426614174000',
      userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
      name: 'Fresh Produce',
      visibility: [TransactionType.EXPENSE],
      deleted: false,
      parentCategoryId: '456e7890-f12c-45d6-e789-426614174888',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(dto).toBeDefined();
    expect(dto.parentCategoryId).toEqual(
      '456e7890-f12c-45d6-e789-426614174888',
    );
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const plainObj = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
        name: 'Groceries',
        visibility: [TransactionType.EXPENSE],
        deleted: false,
        parentCategoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = TransactionCategoryDto.createFromPlain(plainObj);
      expect(dto).toBeInstanceOf(TransactionCategoryDto);
      expect(dto.name).toEqual('Groceries');
    });

    it('should create DTOs from an array of plain objects', () => {
      const plainObjs = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
          name: 'Groceries',
          visibility: [TransactionType.EXPENSE],
          deleted: false,
          parentCategoryId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '234f5678-f90a-23e4-b567-426614174111',
          userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
          name: 'Entertainment',
          visibility: [TransactionType.EXPENSE],
          deleted: false,
          parentCategoryId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const dtos = TransactionCategoryDto.createFromPlain(plainObjs);
      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionCategoryDto);
      expect(dtos[1]).toBeInstanceOf(TransactionCategoryDto);
      expect(dtos[0].name).toEqual('Groceries');
      expect(dtos[1].name).toEqual('Entertainment');
    });
  });
});
