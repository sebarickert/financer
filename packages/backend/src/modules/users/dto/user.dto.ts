import { ApiProperty } from '@nestjs/swagger';
import { Role, Theme, User } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import { UserId } from '@/types/user-id';

export class UserDto implements User {
  constructor(data: User) {
    Object.assign(this, data);
  }

  @IsUUID()
  @ApiProperty({ type: 'string' })
  id!: UserId;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsNotEmpty()
  @ApiProperty()
  nickname!: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  githubId!: string | null;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  auth0Id!: string | null;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  profileImageUrl!: string | null;

  @IsOptional()
  @IsEnum(Role, {
    each: true,
    message: `Role must be one of followings: ${Object.values(Role).join(
      ', ',
    )}.`,
  })
  @ApiProperty({ enum: Role, enumName: 'Role', type: [Role] })
  roles!: Role[];

  @IsOptional()
  @IsEnum(Theme)
  @ApiProperty({ enum: Theme, enumName: 'Theme', type: Theme })
  theme!: Theme;

  public static createFromPlain(users: User): UserDto;
  public static createFromPlain(users: User[]): UserDto[];
  public static createFromPlain(users: User | User[]): UserDto | UserDto[] {
    if (Array.isArray(users)) {
      return users.map((user) => UserDto.createFromPlain(user));
    }

    return new UserDto(users);
  }
}
