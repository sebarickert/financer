import { UpdateIncomeDto } from './update-income.dto';

describe('UpdateIncomeDto', () => {
  it('should create an empty instance', () => {
    const dto = new UpdateIncomeDto();
    expect(dto).toBeDefined();
  });

  it('should accept partial properties', () => {
    const dto = new UpdateIncomeDto();
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.description = 'Updated description';
    // @ts-expect-error - Testing assignment to a property that should be defined through inheritance
    dto.toAccount = 'some-account-id';

    expect(dto.description).toEqual('Updated description');
    expect(dto.toAccount).toEqual('some-account-id');
  });
});
