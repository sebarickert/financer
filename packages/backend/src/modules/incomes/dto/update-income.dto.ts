import { PartialType } from '@nestjs/mapped-types';

import { CreateIncomeDto } from './create-income.dto';

export class UpdateIncomeDto extends PartialType(CreateIncomeDto) {}
