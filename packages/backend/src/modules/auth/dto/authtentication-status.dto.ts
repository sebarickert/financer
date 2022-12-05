import { UserDto } from '@local/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthenticationStatusDto {
  @ApiProperty()
  authenticated: boolean;

  @ApiPropertyOptional()
  payload?: UserDto;
}
