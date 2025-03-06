import { Decimal } from '@prisma/client/runtime/library';

import { TransferListItemDto } from './transfer-list-item.dto';

describe('TransferListItemDto', () => {
  const mockDate = new Date();

  const mockTransfer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('1250.00'),
    description: 'Fund Transfer',
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    toAccount: '345g6789-g01b-34f5-c678-426614174222',
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransferListItemDto(mockTransfer);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('1250.00'));
    expect(dto.description).toEqual('Fund Transfer');
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.toAccount).toEqual('345g6789-g01b-34f5-c678-426614174222');
  });
});
