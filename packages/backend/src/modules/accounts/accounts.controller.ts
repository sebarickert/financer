import { AccountType, CreateAccountDto, UpdateAccountDto } from '@local/types';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { AccountsService } from './accounts.service';

@Controller('api/accounts')
@LoggedIn()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(
    @UserId() userId: ObjectId,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(userId, createAccountDto);
  }

  @Get()
  async findAllByUser(
    @UserId() userId: ObjectId,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query(
      'accountTypes',
      new ParseArrayPipe({ separator: '|', optional: true }),
    )
    accountTypes?: AccountType[],
  ) {
    return this.accountsService.findAllByUser(
      userId,
      accountTypes,
      limit || undefined,
      page || undefined,
    );
  }

  @Get(':id')
  async findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.accountsService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(userId, id, updateAccountDto);
  }

  @Delete(':id')
  remove(@UserId() userId: ObjectId, @Param('id') id: ObjectId) {
    return this.accountsService.remove(id, userId);
  }

  @Get(':id/balance-history')
  async getAccountBalanceHistory(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.accountsService.getAccountBalanceHistory(userId, id);
  }
}
