import { IsEnum, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { Role } from '../schemas/user.schema';

export class UserDto {
  @IsMongoId()
  _id: ObjectId;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  nickname: string;

  @IsOptional()
  @IsNotEmpty()
  githubId: string;

  @IsOptional()
  @IsNotEmpty()
  auth0Id: string;

  @IsOptional()
  @IsNotEmpty()
  profileImageUrl: string;

  @IsOptional()
  @IsEnum(Role, {
    each: true,
    message: `Role must be one of followings: ${Object.values(Role).join(
      ', ',
    )}.`,
  })
  roles: Role[];
}
