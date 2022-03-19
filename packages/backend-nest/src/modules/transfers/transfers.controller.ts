import { Controller, Get } from '@nestjs/common';

import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { TransfersService } from './transfers.service';

@Controller('api/transfers')
@LoggedIn()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  findAllByUser(@UserId() userId: string) {
    return this.transfersService.findAllByUser(userId);
  }
}
