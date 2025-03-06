import { Decimal } from '@prisma/client/runtime/library';

import { UpdateTransactionDto } from './update-transaction.dto';

describe('UpdateTransactionDto', () => {
  it('should create an empty instance', () => {
    const dto = new UpdateTransactionDto();
    expect(dto).toBeDefined();
  });

  it('should accept partial properties', () => {
    const dto = new UpdateTransactionDto();
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.description = 'Updated description';
    // @ts-expect-error - Testing that these properties don't exist on the type
    dto.amount = new Decimal('500.00');

    expect(dto.description).toEqual('Updated description');
    expect(dto.amount).toEqual(new Decimal('500.00'));
  });
});
