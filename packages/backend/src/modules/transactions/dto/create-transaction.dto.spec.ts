import { Decimal } from '@prisma/client/runtime/library';

import { CreateTransactionDto } from './create-transaction.dto';

import { CreateTransactionCategoryMappingWithoutTransactionDto } from '@/transaction-category-mappings/dto/create-transaction-category-mapping-without-transaction.dto';

describe('CreateTransactionDto', () => {
  it('should create an empty instance', () => {
    const dto = new CreateTransactionDto();
    expect(dto).toBeDefined();
  });

  it('should not have id, userId, createdAt, updatedAt fields', () => {
    const dto = new CreateTransactionDto();

    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.id).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.userId).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.createdAt).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.updatedAt).toBeUndefined();
  });

  it('should accept required transaction properties and optional account properties', () => {
    const dto = new CreateTransactionDto();
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.amount = new Decimal('125.50');
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.description = 'Grocery shopping';
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.date = new Date();

    // Optional properties
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.fromAccount = '234f5678-f90a-23e4-b567-426614174111';

    expect(dto.amount).toEqual(new Decimal('125.50'));
    expect(dto.description).toEqual('Grocery shopping');
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.toAccount).toBeUndefined();
  });

  it('should accept category mappings', () => {
    const dto = new CreateTransactionDto();
    const mockDate = new Date();
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.amount = new Decimal('125.50');
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.description = 'Grocery shopping';
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.date = mockDate;

    const categoryMapping: CreateTransactionCategoryMappingWithoutTransactionDto =
      {
        categoryId: '456e7890-f12c-45d6-e789-426614174888',
        amount: new Decimal('125.50'),
        description: 'Grocery items',
      };

    dto.categories = [categoryMapping];

    expect(dto.categories).toHaveLength(1);
    expect(dto.categories[0].categoryId).toEqual(
      '456e7890-f12c-45d6-e789-426614174888',
    );
    expect(dto.categories[0].amount).toEqual(new Decimal('125.50'));
  });
});
