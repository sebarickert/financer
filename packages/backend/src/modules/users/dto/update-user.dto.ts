import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserOwnUserDto extends OmitType(UpdateUserDto, [
  'roles',
  'auth0Id',
  'githubId',
] as const) {}
