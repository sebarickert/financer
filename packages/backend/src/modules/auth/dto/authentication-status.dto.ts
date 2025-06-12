import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';

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
  @IsBoolean()
  authenticated!: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => UserDto)
  @ValidateNested()
  payload?: UserDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasAccounts?: boolean;
}
