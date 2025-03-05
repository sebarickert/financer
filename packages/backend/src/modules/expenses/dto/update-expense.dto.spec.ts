import { UpdateExpenseDto } from './update-expense.dto';

describe('UpdateExpenseDto', () => {
  it('should create an empty instance', () => {
    const dto = new UpdateExpenseDto();
    expect(dto).toBeDefined();
  });

  it('should accept partial properties', () => {
    const dto = new UpdateExpenseDto();
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.description = 'Updated description';
    // @ts-expect-error - Testing assignment to a property that should be defined through inheritance
    dto.fromAccount = 'some-account-id';

    expect(dto.description).toEqual('Updated description');
    expect(dto.fromAccount).toEqual('some-account-id');
  });
});
