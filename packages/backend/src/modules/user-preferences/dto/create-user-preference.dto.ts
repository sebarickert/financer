import { OmitType } from '@nestjs/swagger';

import { UserPreferenceDto } from './user-preference.dto';

export class CreateUserPreferenceDto extends OmitType(UserPreferenceDto, [
  'id',
  'userId',
  'createdAt',
  'updatedAt',
] as const) {}
