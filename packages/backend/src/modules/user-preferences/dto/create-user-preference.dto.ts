import { OmitType } from '@nestjs/swagger';

import { UserPreferenceDto } from './user-preference.dto';

export class CreateUserPreferenceDto extends OmitType(UserPreferenceDto, [
  'id',
  'userId',
  'createdAt',
  'updatedAt',
] as const) {
  constructor(data?: CreateUserPreferenceDto) {
    super();

    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.key = data.key;
      // @ts-expect-error - we have to manually assign these properties
      this.value = data.value;
    }
  }
}
