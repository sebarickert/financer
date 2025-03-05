import { TransactionType } from '@prisma/client';

import { CreateTransactionCategoryDto } from './create-transaction-category.dto';

describe('CreateTransactionCategoryDto', () => {
  it('should create an empty instance', () => {
    const dto = new CreateTransactionCategoryDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const dto = new CreateTransactionCategoryDto();
    dto.name = 'Groceries';
    dto.visibility = [TransactionType.EXPENSE];
    dto.parentCategoryId = null;

    expect(dto).toBeDefined();
    expect(dto.name).toEqual('Groceries');
    expect(dto.visibility).toEqual([TransactionType.EXPENSE]);
    expect(dto.parentCategoryId).toBeNull();
  });

  it('should create an instance with parent category', () => {
    const dto = new CreateTransactionCategoryDto();
    dto.name = 'Fresh Produce';
    dto.visibility = [TransactionType.EXPENSE];
    dto.parentCategoryId = '456e7890-f12c-45d6-e789-426614174888';

    expect(dto).toBeDefined();
    expect(dto.name).toEqual('Fresh Produce');
    expect(dto.visibility).toEqual([TransactionType.EXPENSE]);
    expect(dto.parentCategoryId).toEqual(
      '456e7890-f12c-45d6-e789-426614174888',
    );
  });

  it('should not have id, userId, deleted, createdAt, updatedAt fields', () => {
    const dto = new CreateTransactionCategoryDto();

    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.id).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.userId).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.deleted).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.createdAt).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.updatedAt).toBeUndefined();
  });
});
