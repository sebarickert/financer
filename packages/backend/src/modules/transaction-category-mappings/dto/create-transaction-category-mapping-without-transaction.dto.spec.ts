import { Decimal } from '@prisma/client/runtime/library';

import { CreateTransactionCategoryMappingWithoutTransactionDto } from './create-transaction-category-mapping-without-transaction.dto';

describe('CreateTransactionCategoryMappingWithoutTransactionDto', () => {
  it('should create an empty instance', () => {
    const dto = new CreateTransactionCategoryMappingWithoutTransactionDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with constructor parameters', () => {
    const dto = new CreateTransactionCategoryMappingWithoutTransactionDto({
      description: 'Grocery shopping',
      categoryId: '456e7890-f12c-45d6-e789-426614174888',
      amount: new Decimal('42.50'),
    });

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Grocery shopping');
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.amount.toNumber()).toEqual(42.5);
  });

  it('should create an instance with provided properties', () => {
    const dto = new CreateTransactionCategoryMappingWithoutTransactionDto();
    dto.description = 'Grocery shopping';
    dto.categoryId = '456e7890-f12c-45d6-e789-426614174888';
    dto.amount = new Decimal('42.50');

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Grocery shopping');
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.amount.toNumber()).toEqual(42.5);
  });

  it('should not have transactionId field', () => {
    const dto = new CreateTransactionCategoryMappingWithoutTransactionDto();

    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.transactionId).toBeUndefined();
  });

  it('should not have id, userId, createdAt, updatedAt fields', () => {
    const dto = new CreateTransactionCategoryMappingWithoutTransactionDto();

    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.id).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.userId).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.createdAt).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.updatedAt).toBeUndefined();
  });
});
