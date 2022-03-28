import { Controller, Get, Param } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { TransactionsService } from './transactions.service';

@Controller('api/transactions')
@LoggedIn()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  findAllByUser(@UserId() userId: ObjectId) {
    return this.transactionsService.findAllByUser(userId);
  }

  @Get('/account/:id')
  async findAllByAccount(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionsService.findAllByAccount(userId, id);
  }

  @Get(':id')
  async findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionsService.findOne(userId, id);
  }
}
