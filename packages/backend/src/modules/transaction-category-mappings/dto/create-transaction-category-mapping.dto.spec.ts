import { Decimal } from '@prisma/client/runtime/library';

import { CreateTransactionCategoryMappingDto } from './create-transaction-category-mapping.dto';

describe('CreateTransactionCategoryMappingDto', () => {
  it('should create an empty instance', () => {
    const dto = new CreateTransactionCategoryMappingDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with constructor parameters', () => {
    const dto = new CreateTransactionCategoryMappingDto({
      description: 'Grocery shopping',
      categoryId: '456e7890-f12c-45d6-e789-426614174888',
      transactionId: '789a1234-b56c-78d9-e012-426614174777',
      amount: new Decimal('42.50'),
    });

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Grocery shopping');
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.transactionId).toEqual('789a1234-b56c-78d9-e012-426614174777');
    expect(dto.amount.toNumber()).toEqual(42.5);
  });

  it('should create an instance with provided properties', () => {
    const dto = new CreateTransactionCategoryMappingDto();
    dto.description = 'Grocery shopping';
    dto.categoryId = '456e7890-f12c-45d6-e789-426614174888';
    dto.transactionId = '789a1234-b56c-78d9-e012-426614174777';
    dto.amount = new Decimal('42.50');

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Grocery shopping');
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.transactionId).toEqual('789a1234-b56c-78d9-e012-426614174777');
    expect(dto.amount.toNumber()).toEqual(42.5);
  });

  it('should create an instance with null description', () => {
    const dto = new CreateTransactionCategoryMappingDto();
    dto.description = null;
    dto.categoryId = '456e7890-f12c-45d6-e789-426614174888';
    dto.transactionId = '789a1234-b56c-78d9-e012-426614174777';
    dto.amount = new Decimal('42.50');

    expect(dto).toBeDefined();
    expect(dto.description).toBeNull();
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.transactionId).toEqual('789a1234-b56c-78d9-e012-426614174777');
  });

  it('should not have id, userId, createdAt, updatedAt fields', () => {
    const dto = new CreateTransactionCategoryMappingDto();

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
