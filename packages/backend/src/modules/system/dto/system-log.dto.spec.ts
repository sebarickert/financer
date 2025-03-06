import { SystemLogLevel } from '@prisma/client';

import { SystemLogDto } from './system-log.dto';

describe('SystemLogDto', () => {
  it('should create an empty instance', () => {
    const dto = new SystemLogDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const now = new Date();
    const dto = new SystemLogDto({
      id: '123e4567-e89b-12d3-a456-426614174000',
      module: 'test-module',
      service: 'test-service',
      message: 'test message',
      level: SystemLogLevel.INFO,
      createdAt: now,
      updatedAt: now,
    });

    expect(dto).toBeDefined();
    expect(dto.id).toEqual('123e4567-e89b-12d3-a456-426614174000');
    expect(dto.module).toEqual('test-module');
    expect(dto.service).toEqual('test-service');
    expect(dto.message).toEqual('test message');
    expect(dto.level).toEqual(SystemLogLevel.INFO);
    expect(dto.createdAt).toEqual(now);
    expect(dto.updatedAt).toEqual(now);
  });

  it('should create an instance with partial properties', () => {
    const dto = new SystemLogDto({
      module: 'test-module',
      service: 'test-service',
      message: 'test message',
      level: SystemLogLevel.ERROR,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '5941476d-3261-46a0-b7e1-e0f6e0451835',
    });

    expect(dto).toBeDefined();
    expect(dto.module).toEqual('test-module');
    expect(dto.service).toEqual('test-service');
    expect(dto.message).toEqual('test message');
    expect(dto.level).toEqual(SystemLogLevel.ERROR);
    expect(dto.createdAt).toBeDefined();
    expect(dto.updatedAt).toBeDefined();
    expect(dto.id).toEqual('5941476d-3261-46a0-b7e1-e0f6e0451835');
  });
});
