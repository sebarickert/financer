import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

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
  async findAllByUser(@UserId() userId: ObjectId) {
    return this.accountsService.findAllByUser(userId);
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
  remove(@Param('id') id: ObjectId) {
    return this.accountsService.remove(+id);
  }

  @Get(':id/balance-history')
  async getAccountBalanceHistory(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.accountsService.getAccountBalanceHistory(userId, id);
  }
}
