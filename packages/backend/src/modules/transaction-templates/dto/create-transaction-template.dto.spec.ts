import { CreateTransactionTemplateDto } from './create-transaction-template.dto';

describe('CreateTransactionTemplateDto', () => {
  it('should create an empty instance', () => {
    const dto = new CreateTransactionTemplateDto();
    expect(dto).toBeDefined();
  });

  it('should initialize with default values', () => {
    const dto = new CreateTransactionTemplateDto();
    expect(dto.amount).toBeNull();
    expect(dto.dayOfMonth).toBeNull();
    expect(dto.dayOfMonthToCreate).toBeNull();
    expect(dto.fromAccount).toBeNull();
    expect(dto.toAccount).toBeNull();
    expect(dto.categories).toEqual([]);
  });

  it('should not have id, userId, createdAt, updatedAt fields', () => {
    const dto = new CreateTransactionTemplateDto();

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
