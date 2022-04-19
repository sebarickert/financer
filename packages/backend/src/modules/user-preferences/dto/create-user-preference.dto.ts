import { UserPreferenceDto } from '@local/types';
import { OmitType } from '@nestjs/mapped-types';

import { ObjectId } from '../../../types/objectId';

class TempClass extends UserPreferenceDto<ObjectId> {}

export class CreateUserPreferenceDto extends OmitType(TempClass, [
  '_id' as const,
]) {}
