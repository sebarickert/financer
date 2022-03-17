import { Controller, Get } from '@nestjs/common';

@Controller('api/expenses')
export class ExpensesController {
  @Get()
  getAllUserExpenses() {
    return '@TODO';
  }
}
