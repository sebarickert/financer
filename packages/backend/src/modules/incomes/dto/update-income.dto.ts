import { PartialType } from '@silte/nestjs-swagger';

import { CreateIncomeDto } from './create-income.dto';

export class UpdateIncomeDto extends PartialType(CreateIncomeDto) {}
