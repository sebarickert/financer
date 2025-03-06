import { OmitType } from '@nestjs/mapped-types';

import { SystemLogDto } from './system-log.dto';

export class CreateSystemLogDto extends OmitType(SystemLogDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {
  constructor(data?: CreateSystemLogDto) {
    super();
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.level = data.level;
      // @ts-expect-error - we have to manually assign these properties
      this.message = data.message;
      // @ts-expect-error - we have to manually assign these properties
      this.module = data.module;
      // @ts-expect-error - we have to manually assign these properties
      this.service = data.service;
    }
  }
}
