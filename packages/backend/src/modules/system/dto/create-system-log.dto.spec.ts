import { SystemLogLevel } from '@prisma/client';

import { CreateSystemLogDto } from './create-system-log.dto';

describe('CreateSystemLogDto', () => {
  it('should create an empty instance', () => {
    const dto = new CreateSystemLogDto();
    expect(dto).toBeDefined();
  });

  it('should create an instance with provided properties', () => {
    const dto = new CreateSystemLogDto({
      module: 'test-module',
      service: 'test-service',
      message: 'test message',
      level: SystemLogLevel.INFO,
    });

    expect(dto).toBeDefined();
    expect(dto.module).toEqual('test-module');
    expect(dto.service).toEqual('test-service');
    expect(dto.message).toEqual('test message');
    expect(dto.level).toEqual(SystemLogLevel.INFO);
  });

  it('should not expose id, createdAt, updatedAt fields', () => {
    const dto = new CreateSystemLogDto({
      module: 'test-module',
      service: 'test-service',
      message: 'test message',
      level: SystemLogLevel.INFO,
    });

    expect(dto).toBeDefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.id).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.createdAt).toBeUndefined();
    // @ts-expect-error - Testing that these properties don't exist on the type
    expect(dto.updatedAt).toBeUndefined();
  });
});
