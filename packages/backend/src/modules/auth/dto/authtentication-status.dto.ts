import { ApiProperty, ApiPropertyOptional } from '@silte/nestjs-swagger';

import { UserDto } from '../../users/dto/user.dto';

export class AuthenticationStatusDto {
  @ApiProperty()
  authenticated: boolean;

  @ApiPropertyOptional()
  payload?: UserDto;
}
