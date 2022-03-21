import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

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
  create(@UserId() userId: string, @Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(userId, createAccountDto);
  }

  @Get()
  findAllByUser(@UserId() userId: string) {
    return this.accountsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@UserId() userId: string, @Param('id', ValidateEntityId) id: string) {
    return this.accountsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id', ValidateEntityId) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(userId, id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.remove(+id);
  }
}
