import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserDto } from '@/users/dto/user.dto';

export class AuthenticationStatusDto {
  constructor(data?: AuthenticationStatusDto) {
    if (data) {
      this.authenticated = data.authenticated;
      this.payload = data.payload;
      this.hasAccounts = data.hasAccounts;
    }
  }

  @ApiProperty()
  authenticated!: boolean;

  @ApiPropertyOptional()
  payload?: UserDto;

  @ApiPropertyOptional()
  hasAccounts?: boolean;
}
