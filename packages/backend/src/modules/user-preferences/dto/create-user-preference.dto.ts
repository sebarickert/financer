import { OmitType } from '@silte/nestjs-swagger';

import { UserPreferenceDto } from './user-preference.dto';

export class CreateUserPreferenceDto extends OmitType(UserPreferenceDto, [
  '_id',
  'userId',
] as const) {}
