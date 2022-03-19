import { Controller, Get } from '@nestjs/common';

import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { ExpensesService } from './expenses.service';

@Controller('api/expenses')
@LoggedIn()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAllByUser(@UserId() userId: string) {
    return this.expensesService.findAllByUser(userId);
  }
}
