import { ApiProperty } from '@nestjs/swagger';
import { UserPreferenceProperty, UserPreferences } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

import { UserId } from '@/types/user-id';

export class UserPreferenceDto implements UserPreferences {
  constructor(userPreference: UserPreferences) {
    Object.assign(this, userPreference);
  }

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @IsUUID()
  @ApiProperty({ type: String })
  readonly id!: string;

  @IsUUID()
  @ApiProperty({ type: String })
  readonly userId!: UserId;

  @IsEnum(UserPreferenceProperty, {
    message: `User preference property must be one of following: ${Object.values(
      UserPreferenceProperty,
    ).join(', ')}.`,
  })
  @ApiProperty({
    enum: UserPreferenceProperty,
    enumName: 'UserPreferenceProperty',
  })
  readonly key!: UserPreferenceProperty;

  @IsNotEmpty()
  @ApiProperty()
  readonly value!: string;

  public static createFromPlain(
    userPreference: UserPreferences,
  ): UserPreferenceDto;
  public static createFromPlain(
    userPreferences: UserPreferences[],
  ): UserPreferenceDto[];
  public static createFromPlain(
    userPreference: UserPreferences | UserPreferences[],
  ): UserPreferenceDto | UserPreferenceDto[] {
    if (Array.isArray(userPreference)) {
      return userPreference.map((preference) =>
        UserPreferenceDto.createFromPlain(preference),
      );
    }

    return new UserPreferenceDto(userPreference);
  }
}
