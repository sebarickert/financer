import { OmitType } from '@silte/nestjs-swagger';

import { UserDataExportDto } from './user-data-export.dto';

export class UserDataImportDto extends OmitType(UserDataExportDto, [
  'user',
] as const) {}
