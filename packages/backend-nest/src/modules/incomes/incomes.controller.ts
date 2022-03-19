import { Controller, Get } from '@nestjs/common';

import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { IncomesService } from './incomes.service';

@Controller('api/incomes')
@LoggedIn()
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get()
  findAllByUser(@UserId() userId: string) {
    return this.incomesService.findAllByUser(userId);
  }
}
