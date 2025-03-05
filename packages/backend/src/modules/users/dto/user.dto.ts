import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role, Theme, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import { UserId } from '@/types/user-id';

export class UserDto implements User {
  constructor(data?: User) {
    if (data) {
      this.id = data.id as UserId;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.name = data.name;
      this.nickname = data.nickname;
      this.githubId = data.githubId;
      this.auth0Id = data.auth0Id;
      this.profileImageUrl = data.profileImageUrl;
      this.roles = data.roles;
      this.theme = data.theme;
    }
  }

  @IsUUID()
  @ApiProperty({ type: 'string' })
  id!: UserId;

  @Exclude()
  @ApiHideProperty()
  createdAt!: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt!: Date;

  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsNotEmpty()
  @ApiProperty()
  nickname!: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: String, nullable: true })
  githubId!: string | null;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: String, nullable: true })
  auth0Id!: string | null;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: String, nullable: true })
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
