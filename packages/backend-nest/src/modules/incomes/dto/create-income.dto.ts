import { OmitType } from '@nestjs/mapped-types';

import { IncomeDto } from './income.dto';

export class CreateIncomeDto extends OmitType(IncomeDto, [
  '_id',
  'toAccountBalance',
  'user',
] as const) {}
