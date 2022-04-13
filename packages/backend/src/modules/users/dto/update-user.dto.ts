import {
  UpdateUserDto as SharedUpdateUserDto,
  UpdateUserOwnUserDto as SharedUpdateUserOwnUserDto,
} from '@local/types';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(SharedUpdateUserDto) {}
export class UpdateUserOwnUserDto extends PartialType(
  SharedUpdateUserOwnUserDto,
) {}
