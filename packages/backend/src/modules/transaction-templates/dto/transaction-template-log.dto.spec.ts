import { TransactionTemplateType } from '@prisma/client';

import { TransactionTemplateLogDto } from './transaction-template-log.dto';

import { UserId } from '@/types/user-id';

describe('TransactionTemplateLogDto', () => {
  const mockDate = new Date();

  const mockTemplateLog = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: '987e6543-e21b-34d5-c678-426614174999' as UserId,
    eventType: TransactionTemplateType.AUTO,
    transactionId: '789a1234-b56c-78d9-e012-426614174777',
    templateId: '234f5678-f90a-23e4-b567-426614174111',
    executed: mockDate,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should create an instance with provided properties', () => {
    const dto = new TransactionTemplateLogDto(mockTemplateLog);

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.userId).toEqual('987e6543-e21b-34d5-c678-426614174999');
    expect(dto.eventType).toEqual(TransactionTemplateType.AUTO);
    expect(dto.transactionId).toEqual('789a1234-b56c-78d9-e012-426614174777');
    expect(dto.templateId).toEqual('234f5678-f90a-23e4-b567-426614174111');
    expect(dto.executed).toEqual(mockDate);
    expect(dto.createdAt).toEqual(mockDate);
    expect(dto.updatedAt).toEqual(mockDate);
  });

  describe('createFromPlain', () => {
    it('should create a DTO from a plain object', () => {
      const dto = TransactionTemplateLogDto.createFromPlain(mockTemplateLog);

      expect(dto).toBeInstanceOf(TransactionTemplateLogDto);
      expect(dto.eventType).toEqual(TransactionTemplateType.AUTO);
      expect(dto.executed).toEqual(mockDate);
    });

    it('should create DTOs from an array of plain objects', () => {
      const mockTemplateLogs = [
        mockTemplateLog,
        {
          ...mockTemplateLog,
          id: '234f5678-f90a-23e4-b567-426614174111',
          eventType: TransactionTemplateType.MANUAL,
          executed: new Date(mockDate.getTime() + 86400000), // one day later
        },
      ];

      const dtos = TransactionTemplateLogDto.createFromPlain(mockTemplateLogs);

      expect(dtos).toHaveLength(2);
      expect(dtos[0]).toBeInstanceOf(TransactionTemplateLogDto);
      expect(dtos[1]).toBeInstanceOf(TransactionTemplateLogDto);
      expect(dtos[0].eventType).toEqual(TransactionTemplateType.AUTO);
      expect(dtos[1].eventType).toEqual(TransactionTemplateType.MANUAL);
    });
  });
});
