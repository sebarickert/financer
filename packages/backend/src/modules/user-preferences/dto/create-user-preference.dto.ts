import { UserPreferenceDto } from '@local/types';
import { OmitType } from '@nestjs/swagger';

export class CreateUserPreferenceDto extends OmitType(UserPreferenceDto, [
  '_id',
  'userId',
] as const) {}
