import { OmitType } from '@nestjs/swagger';

import { UserDataExportDto } from './user-data-export.dto';

export class UserDataImportDto extends OmitType(UserDataExportDto, [
  'user',
] as const) {}
