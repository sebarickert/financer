import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { TransferDetailsDto } from './transfer-details.dto';

import { UserId } from '@/types/user-id';

describe('TransferDetailsDto', () => {
  const mockDate = new Date();

  const mockTransfer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    amount: new Decimal('1250.00'),
    description: 'Fund Transfer',
    date: mockDate,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    toAccount: '345g6789-g01b-34f5-c678-426614174222',
    userId: '22d0ba03-19e0-4e4c-a6b2-3c0e14cd05bb' as UserId,
    fromAccountName: 'From account name',
    toAccountName: 'To account name',
    isRecurring: false,
    type: TransactionType.TRANSFER,
    categories: [],
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransferDetailsDto(mockTransfer);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.amount).toEqual(new Decimal('1250.00'));
    expect(dto.description).toEqual('Fund Transfer');
    expect(dto.date).toEqual(mockDate);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.toAccount).toEqual('345g6789-g01b-34f5-c678-426614174222');
    expect(dto.userId).toEqual('22d0ba03-19e0-4e4c-a6b2-3c0e14cd05bb');
    expect(dto.fromAccountName).toEqual('From account name');
    expect(dto.toAccountName).toEqual('To account name');
    expect(dto.isRecurring).toEqual(false);
    // TODO we should add tests to validate transforming since type is only defined on the fly when creating plain from the instance
    // expect(dto.type).toEqual(TransactionType.TRANSFER);
    expect(dto.categories).toEqual([]);
    expect(dto.createdAt).toEqual(mockDate);
    expect(dto.updatedAt).toEqual(mockDate);
  });
});
