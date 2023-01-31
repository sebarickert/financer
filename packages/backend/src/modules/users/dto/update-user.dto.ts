import { PartialType, OmitType, PickType } from '@silte/nestjs-swagger';

import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(UserDto, ['_id' as const]),
) {}

export class UpdateUserOwnUserDto extends PickType(UpdateUserDto, [
  'name',
  'nickname',
  'profileImageUrl',
]) {}
