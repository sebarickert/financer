import { Controller, Get } from '@nestjs/common';

@Controller('api/incomes')
export class IncomesController {
  @Get()
  getAllUserIncomes() {
    return '@TODO';
  }
}
