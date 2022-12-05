import { OmitType } from '@nestjs/swagger';

import { IncomeDto } from './income.dto';

export class CreateIncomeDto extends OmitType(IncomeDto, [
  '_id',
  'user',
] as const) {}
