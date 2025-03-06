import { Decimal } from '@prisma/client/runtime/library';

import { UpdateTransactionCategoryMappingDto } from './update-transaction-category-mapping.dto';

describe('UpdateTransactionCategoryMappingDto', () => {
  it('should create an empty instance', () => {
    const dto = new UpdateTransactionCategoryMappingDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with constructor parameters', () => {
    const dto = new UpdateTransactionCategoryMappingDto({
      description: 'Updated description',
      categoryId: '456e7890-f12c-45d6-e789-426614174888',
      transactionId: '789a1234-b56c-78d9-e012-426614174777',
      amount: new Decimal('99.99'),
    });

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Updated description');
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.transactionId).toEqual('789a1234-b56c-78d9-e012-426614174777');
    expect(dto.amount?.toNumber()).toEqual(99.99);
  });

  it('should create an instance with partial constructor parameters', () => {
    const dto = new UpdateTransactionCategoryMappingDto({
      description: 'Updated grocery description',
    });

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Updated grocery description');
    expect(dto.categoryId).toBeUndefined();
    expect(dto.transactionId).toBeUndefined();
    expect(dto.amount).toBeUndefined();
  });

  it('should allow partial updates with only some fields', () => {
    const dto = new UpdateTransactionCategoryMappingDto();
    dto.description = 'Updated grocery description';

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Updated grocery description');
    expect(dto.categoryId).toBeUndefined();
    expect(dto.transactionId).toBeUndefined();
    expect(dto.amount).toBeUndefined();
  });

  it('should allow updating all fields', () => {
    const dto = new UpdateTransactionCategoryMappingDto();
    dto.description = 'Updated description';
    dto.categoryId = '456e7890-f12c-45d6-e789-426614174888';
    dto.transactionId = '789a1234-b56c-78d9-e012-426614174777';
    dto.amount = new Decimal('99.99');

    expect(dto).toBeDefined();
    expect(dto.description).toEqual('Updated description');
    expect(dto.categoryId).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.transactionId).toEqual('789a1234-b56c-78d9-e012-426614174777');
    expect(dto.amount.toNumber()).toEqual(99.99);
  });

  it('should not have id, userId, createdAt, updatedAt fields', () => {
    const dto = new UpdateTransactionCategoryMappingDto();

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
