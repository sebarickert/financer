import { Controller, Get, Param, Query } from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { TransactionsService, TransactionType } from './transactions.service';

@Controller('api/transactions')
@LoggedIn()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAllByUser(
    @UserId() userId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.transactionsService.findAllByUser(
      userId,
      TransactionType.ANY,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
    );
  }

  @Get('/account/:id')
  async findAllByAccount(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) accountId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.transactionsService.findAllByUser(
      userId,
      TransactionType.ANY,
      page || undefined,
      limit || undefined,
      year || undefined,
      month || undefined,
      accountId,
    );
  }

  @Get(':id')
  async findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transactionsService.findOne(userId, id);
  }
}
