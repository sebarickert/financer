import { PickType } from '@nestjs/swagger';

import { UpdateUserDto } from './update-user.dto';

export class UpdateOwnUserDto extends PickType(UpdateUserDto, [
  'name',
  'nickname',
  'profileImageUrl',
  'theme',
]) {
  constructor(data?: UpdateOwnUserDto) {
    super();

    if (data) {
      this.name = data.name;
      this.nickname = data.nickname;
      this.profileImageUrl = data.profileImageUrl;
      this.theme = data.theme;
    }
  }
}
