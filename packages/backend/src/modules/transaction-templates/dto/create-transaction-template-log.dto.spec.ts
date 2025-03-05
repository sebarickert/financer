import { CreateTransactionTemplateLogDto } from './create-transaction-template-log.dto';

describe('CreateTransactionTemplateLogDto', () => {
  it('should create an empty instance', () => {
    const dto = new CreateTransactionTemplateLogDto();
    expect(dto).toBeDefined();
  });

  it('should not have id, createdAt, updatedAt fields', () => {
    const dto = new CreateTransactionTemplateLogDto();

    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.id).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.createdAt).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.updatedAt).toBeUndefined();
  });
});
