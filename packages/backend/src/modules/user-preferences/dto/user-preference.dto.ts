import { UserPreferenceProperty } from '@local/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsEnum, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UserPreferenceDto {
  @IsMongoId()
  @ApiProperty({ type: String })
  readonly _id: ObjectId;

  @IsMongoId()
  @ApiProperty({ type: String })
  readonly userId: ObjectId;

  @IsEnum(UserPreferenceProperty, {
    message: `User preference property must be one of following: ${Object.values(
      UserPreferenceProperty,
    ).join(', ')}.`,
  })
  @ApiProperty({
    enum: UserPreferenceProperty,
    enumName: 'UserPreferenceProperty',
  })
  readonly key: UserPreferenceProperty;

  @IsNotEmpty()
  @ApiProperty()
  readonly value: string;
}
