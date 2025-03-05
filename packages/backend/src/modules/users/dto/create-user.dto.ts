import { OmitType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class CreateUserDto extends OmitType(UserDto, [
  'id',
  'createdAt',
  'updatedAt',
] as const) {
  constructor(data?: CreateUserDto) {
    super();

    if (data) {
      this.name = data.name;
      this.nickname = data.nickname;
      this.profileImageUrl = data.profileImageUrl;
      this.theme = data.theme;
    }
  }
}
