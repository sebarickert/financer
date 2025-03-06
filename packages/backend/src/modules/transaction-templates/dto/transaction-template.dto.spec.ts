import { TransactionTemplateType, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { TransactionTemplateDto } from './transaction-template.dto';

import { UserId } from '@/types/user-id';

describe('TransactionTemplateDto', () => {
  const mockDate = new Date();

  const mockTemplate = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
    templateName: 'Monthly Rent',
    templateType: [TransactionTemplateType.AUTO],
    templateVisibility: TransactionType.EXPENSE,
    amount: new Decimal('1250.00'),
    description: 'Apartment rent payment',
    dayOfMonth: 1,
    dayOfMonthToCreate: 25,
    fromAccount: '234f5678-f90a-23e4-b567-426614174111',
    toAccount: null,
    categories: ['456e7890-f12c-45d6-e789-426614174888'],
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransactionTemplateDto(mockTemplate);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.userId).toEqual('987e6543-e21b-34d5-c678-426614174999');
    expect(dto.templateName).toEqual('Monthly Rent');
    expect(dto.templateType).toEqual([TransactionTemplateType.AUTO]);
    expect(dto.templateVisibility).toEqual(TransactionType.EXPENSE);
    expect(dto.amount).toEqual(new Decimal('1250.00'));
    expect(dto.description).toEqual('Apartment rent payment');
    expect(dto.dayOfMonth).toEqual(1);
    expect(dto.dayOfMonthToCreate).toEqual(25);
    expect(dto.fromAccount).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.toAccount).toBeNull();
    expect(dto.categories).toEqual(['456e7890-f12c-45d6-e789-426614174888']);
    expect(dto.createdAt).toEqual(mockDate);
    expect(dto.updatedAt).toEqual(mockDate);
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const dto = TransactionTemplateDto.createFromPlain(mockTemplate);

      expect(dto).toBeInstanceOf(TransactionTemplateDto);
      expect(dto.templateName).toEqual('Monthly Rent');
      expect(dto.amount).toEqual(new Decimal('1250.00'));
    });

    it('should handle amount that is not a Decimal instance', () => {
      const mockWithStringAmount = {
        ...mockTemplate,
        amount: '1250.00',
      };

      // @ts-expect-error - Testing with string amount instead of Decimal
      const dto = TransactionTemplateDto.createFromPlain(mockWithStringAmount);

      expect(dto).toBeInstanceOf(TransactionTemplateDto);
      expect(dto.amount).toBeNull();
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockTemplates = [
        mockTemplate,
        {
          ...mockTemplate,
          id: '234f5678-f90a-23e4-b567-426614174111',
          templateName: 'Utility Bill',
          amount: new Decimal('85.75'),
        },
      ];

      const dtos = TransactionTemplateDto.createFromPlain(mockTemplates);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionTemplateDto);
      expect(dtos[1]).toBeInstanceOf(TransactionTemplateDto);
      expect(dtos[0].templateName).toEqual('Monthly Rent');
      expect(dtos[1].templateName).toEqual('Utility Bill');
      expect(dtos[0].amount?.toNumber()).toEqual(1250);
      expect(dtos[1].amount?.toNumber()).toEqual(85.75);
    });
  });
});
