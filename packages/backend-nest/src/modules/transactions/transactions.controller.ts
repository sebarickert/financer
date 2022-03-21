import { Controller, Get, Param } from '@nestjs/common';
import { ValidateEntityId } from 'src/utils/validate-entity-id.pipe';

import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { TransactionsService } from './transactions.service';

@Controller('api/transactions')
@LoggedIn()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAllByUser(@UserId() userId: string) {
    return this.transactionsService.findAllByUser(userId);
  }

  @Get('/account/:id')
  async findAllByAccount(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.transactionsService.findAllByAccount(userId, id);
  }

  @Get(':id')
  async findOne(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
  ) {
    return this.transactionsService.findOne(userId, id);
  }
}
