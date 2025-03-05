import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  constructor(data?: Partial<UpdateUserDto>) {
    super();

    if (data) {
      this.name = data.name;
      this.nickname = data.nickname;
      this.profileImageUrl = data.profileImageUrl;
      this.theme = data.theme;
    }
  }
}
