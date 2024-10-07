import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { IsMongoId, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

import { UserId } from '../../../types/user-id';

export class UserDto implements User {
  constructor(data: User) {
    Object.assign(this, data);
  }

  @IsMongoId()
  @ApiProperty({ type: 'string' })
  id: UserId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  nickname: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  githubId: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  auth0Id: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  profileImageUrl: string;

  @IsOptional()
  @IsEnum(Role, {
    each: true,
    message: `Role must be one of followings: ${Object.values(Role).join(
      ', ',
    )}.`,
  })
  @ApiProperty({ enum: Role, enumName: 'Role', type: [Role] })
  roles: Role[];

  public static createFromPlain(users: User): UserDto;
  public static createFromPlain(users: User[]): UserDto[];
  public static createFromPlain(users: User | User[]): UserDto | UserDto[] {
    if (Array.isArray(users)) {
      return users.map((user) => UserDto.createFromPlain(user));
    }

    return new UserDto(users);
  }
}
