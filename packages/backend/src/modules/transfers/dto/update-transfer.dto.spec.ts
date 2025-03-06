import { UpdateTransferDto } from './update-transfer.dto';

describe('UpdateTransferDto', () => {
  it('should create an empty instance', () => {
    const dto = new UpdateTransferDto();
    expect(dto).toBeDefined();
  });

  it('should accept partial properties', () => {
    const dto = new UpdateTransferDto();
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.description = 'Updated description';
    // @ts-expect-error - Testing assignment to a property that should be defined through inheritance
    dto.fromAccount = 'some-account-id';

    expect(dto.description).toEqual('Updated description');
    expect(dto.fromAccount).toEqual('some-account-id');
  });
});
