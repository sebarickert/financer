import { TransactionListItemCategoryDto } from './transaction-list-item-category.dto';

describe('TransactionListItemCategoryDto', () => {
  it('should create an empty instance', () => {
    const dto = new TransactionListItemCategoryDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const dto = new TransactionListItemCategoryDto({
      id: '456e7890-f12c-45d6-e789-426614174888',
      name: 'Housing',
    });

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('456e7890-f12c-45d6-e789-426614174888');
    expect(dto.name).toEqual('Housing');
  });
});
