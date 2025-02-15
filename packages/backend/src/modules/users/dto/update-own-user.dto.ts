import { PickType } from '@nestjs/swagger';

import { UpdateUserDto } from './update-user.dto';

export class UpdateUserOwnUserDto extends PickType(UpdateUserDto, [
  'name',
  'nickname',
  'profileImageUrl',
  'theme',
]) {}
